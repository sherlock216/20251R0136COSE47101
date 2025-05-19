import fs from 'fs';

import { GitHubUser, isLanguage, UsersDataWithRepos } from './types';
import stopWatch from './utils/stopWatch';
import { getGitHubReposList } from './utils/getGitHubReposList';
import { DATA_SIZE, ID_PRESET } from './getEnv';

async function main() {
  console.log('🚀 유저 별 레포지토리 목록을 추가해요!');

  const userList: GitHubUser[] = JSON.parse(
    fs.readFileSync(
      `results/users_v2_${ID_PRESET}_${ID_PRESET + DATA_SIZE}.json`,
      'utf8'
    )
  );

  if (userList === undefined || userList.length === 0) {
    console.error('유저 데이터가 없어요!');
    return;
  }

  const usersDataWithRepos: UsersDataWithRepos[] = [];

  const { stop, lap } = stopWatch();

  for (const [index, user] of userList.entries()) {
    if (index % 10 === 0 && index !== 0) lap();

    console.log(
      `[${((index / userList.length) * 100).toFixed(2)}%] 크롤링 유저: ${
        user.login
      }`
    );

    const repos = await getGitHubReposList(user.repos_url);
    const filteredRepos = repos.filter(
      repo =>
        repo.size > 500 && repo.language !== null && isLanguage(repo.language)
    );
    if (filteredRepos.length < 3) continue;
    usersDataWithRepos.push({
      ...user,
      repos: filteredRepos,
    });
  }

  console.log(
    `${userList.length}개의 유저 데이터 중 유효한 ${usersDataWithRepos.length}개의 프로필을 크롤링했어요!`
  );
  console.log(`종합 수율: ${(usersDataWithRepos.length / DATA_SIZE) * 100}%`);
  stop();

  fs.writeFileSync(
    `results/userDataWithRepos_v2_${ID_PRESET}_${ID_PRESET + DATA_SIZE}.json`,
    JSON.stringify(usersDataWithRepos, null, 2)
  );
}

main().catch(console.error);
