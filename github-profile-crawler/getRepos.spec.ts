import fs from 'fs';
import 'dotenv/config';

import { GitHubRepository, GitHubUser, UsersDataWithRepos } from './types';
import stopWatch from './utils/stopWatch';
import { getGitHubReposList } from './utils/getGitHubReposList';

async function main() {
  console.log('🚀 유저 별 레포지토리 목록을 추가해요!');

  const userList: GitHubUser[] = JSON.parse(
    fs.readFileSync('results/users.json', 'utf8')
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
    const filteredRepos = repos.filter(repo => repo.size > 500);
    if (filteredRepos.length < 3) continue;
    const starredRepos = await getGitHubReposList(
      user.starred_url.split('{')[0]
    );
    usersDataWithRepos.push({
      ...user,
      repos: filteredRepos.slice(0, 10),
      starredRepos: starredRepos.slice(0, 10),
    });
  }

  console.log(
    `${userList.length}개의 유저 데이터 중 유효한 ${usersDataWithRepos.length}개의 프로필을 크롤링했어요!`
  );
  stop();

  fs.writeFileSync(
    'results/userDataWithRepos.json',
    JSON.stringify(usersDataWithRepos, null, 2)
  );
}

main().catch(console.error);
