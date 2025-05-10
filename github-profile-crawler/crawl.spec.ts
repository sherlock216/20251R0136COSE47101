import { chromium, Browser } from 'playwright';
import { GitHubProfile } from './types';
import { crawlGitHubProfile } from './utils/crawlGitHubProfile';
import { saveToCSV } from './utils/saveToCSV';

async function main() {
  console.log('🚀 크롤링을 시작해요!');

  // TODO: GitHub API 사용
  const profileUrls = ['https://github.com/halionaz'];

  const browser: Browser = await chromium.launch({
    headless: false, // TODO: Change to true. False if for Debugging
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const profiles: GitHubProfile[] = [];

    for (const url of profileUrls) {
      console.log(`크롤링 유저: ${url}`);
      const profile = await crawlGitHubProfile(page, url);
      profiles.push(profile);
    }

    await saveToCSV(profiles);
  } catch (error) {
    console.error('에러가 발생했어요: ', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
