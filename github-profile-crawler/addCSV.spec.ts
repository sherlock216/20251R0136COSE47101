import fs from 'fs';
import 'dotenv/config';

import { UsersDataWithRepos } from './types';
import processData from './utils/processData';
import { saveToCSV } from './utils/saveToCSV';

async function main() {
  console.log('🚀 CSV파일을 추가해요!');

  const userList: UsersDataWithRepos[] = JSON.parse(
    fs.readFileSync('results/userDataWithRepos.json', 'utf8')
  );

  if (userList === undefined || userList.length === 0) {
    console.error('유저 데이터가 없어요!');
    return;
  }

  const processedData = await processData(userList);

  saveToCSV(processedData, true);
}

main().catch(console.error);
