import fs from 'fs';
import 'dotenv/config';

import { chromium, Browser } from 'playwright';
import { GitHubProfile, GitHubRepository, GitHubUser } from './types';
import { crawlGitHubProfile } from './utils/crawlGitHubProfile';
import { saveToCSV } from './utils/saveToCSV';
import { getGitHubUserList } from './utils/getGitHubUserList';
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

  const usersDataWithRepos: (GitHubUser & {
    repos: GitHubRepository[];
    starredRepos: GitHubRepository[];
  })[] = [];

  const { stop, lap } = stopWatch();

  for (const [index, user] of userList.entries()) {
    if (index % 10 === 0 && index !== 0) lap();

    console.log(
      `[${((index / userList.length) * 100).toFixed(2)}%] 크롤링 유저: ${
        user.login
      }`
    );

    const repos = await getGitHubReposList(user.repos_url);
    if (repos.length === 0) continue;
    const starredRepos = await getGitHubReposList(
      user.starred_url.split('{')[0]
    );
    usersDataWithRepos.push({ ...user, repos, starredRepos });
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
