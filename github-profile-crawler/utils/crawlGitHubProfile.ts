import { Page } from '@playwright/test';

import { GitHubProfile } from '../types';
import { parseCountValue } from './parseCountValue';

export const crawlGitHubProfile = async (
  page: Page,
  profileUrl: string
): Promise<GitHubProfile> => {
  await page.goto(profileUrl, { waitUntil: 'domcontentloaded' });

  // URL에서 유저 이름 가져오기
  const username = profileUrl.split('/').pop() || '';

  // 팔로워, 팔로잉 수 알아내기
  const followersText =
    (await page
      .locator('a[href$="?tab=followers"] span.text-bold')
      .textContent()) || '0';
  const followingText =
    (await page
      .locator('a[href$="?tab=following"] span.text-bold')
      .textContent()) || '0';

  // 사람 수 데이터 전처리
  const followers = parseCountValue(followersText);
  const following = parseCountValue(followingText);

  // README 긁어오기
  let readme = '';
  try {
    readme = (await page.locator('article.markdown-body').innerText()) || '';
  } catch (error) {
    console.log(`Could not find README for ${username}`);
  }

  // 스타 레포지토리 긁어오기
  // TODO: FIX
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
