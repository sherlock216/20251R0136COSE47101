import { Page } from '@playwright/test';

import { GitHubProfile } from '../types';
import { parseCountValue } from './parseCountValue';

export const crawlGitHubProfile = async (
  page: Page,
  username: string,
  profileUrl: string
): Promise<GitHubProfile> => {
  await page.goto(profileUrl, { waitUntil: 'domcontentloaded' });

  // 팔로워, 팔로잉 수 알아내기
  let followersText = '';
  const followersLocation = await page.locator(
    'a[href$="?tab=followers"] span.text-bold'
  );
  if (await followersLocation.isVisible()) {
    followersText = (await followersLocation.textContent()) || '0';
  }
  let followingText = '';
  const followingLocation = await page.locator(
    'a[href$="?tab=following"] span.text-bold'
  );
  if (await followingLocation.isVisible()) {
    followingText = (await followingLocation.textContent()) || '0';
  }

  // 사람 수 데이터 전처리
  const followers = parseCountValue(followersText);
  const following = parseCountValue(followingText);

  // README 긁어오기
  let readme = '';
  const readmeElement = await page.locator('article.markdown-body').first();
  if (await readmeElement.isVisible()) {
    readme = (await readmeElement.innerText()) || '';
  }

  // 스타 레포지토리 긁어오기
  await page.goto(`${profileUrl}?tab=stars`, { waitUntil: 'domcontentloaded' });

  const starredRepos: string[] = [];
  const starredRepoElements = await page.locator('.col-12 h3').all();

  for (const element of starredRepoElements) {
    const repoName = await element.innerText();
    if (repoName) {
      starredRepos.push(repoName.trim());
    }
    if (starredRepos.length >= 10) break;
  }

  return {
    username,
    followers,
    following,
    readme,
    starredRepos,
  };
};
