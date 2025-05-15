import 'dotenv/config';
import { chromium, Browser } from 'playwright';
import { GitHubProfile } from './types';
import { crawlGitHubProfile } from './utils/crawlGitHubProfile';
import { saveToCSV } from './utils/saveToCSV';
import { getGitHubUserList } from './utils/getGitHubUserList';
import stopWatch from './utils/stopWatch';

async function main() {
  console.log('🚀 크롤링을 시작해요!');

  const dataSize = parseInt(process.env.DATA_SIZE || '100');

  const profileData = await getGitHubUserList(dataSize);

  const browser: Browser = await chromium.launch({
    headless: false, // TODO: Change to true. False if for Debugging
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const profiles: GitHubProfile[] = [];

    const { stop, lap } = stopWatch();

    for (const [index, data] of profileData.entries()) {
      if (index % 10 === 0 && index !== 0) lap();
      console.log(
        `[${((index / profileData.length) * 100).toFixed(2)}%] 크롤링 유저: ${
          data.login
        }`
      );
      const profile = await crawlGitHubProfile(page, data.login, data.html_url);
      profiles.push(profile);
    }

    console.log(
      `${profileData.length}개의 유저 데이터 중 유효한 ${profiles.length}개의 프로필을 크롤링했어요!`
    );
    stop();

    await saveToCSV(profiles);
  } catch (error) {
    console.error('에러가 발생했어요: ', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
