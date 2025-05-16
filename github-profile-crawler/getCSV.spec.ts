import fs from 'fs';
import 'dotenv/config';

import { UsersDataWithRepos } from './types';
import processData from './utils/processData';
import { saveToCSV } from './utils/saveToCSV';

async function main() {
  console.log('🚀 CSV파일을 생성해요!');

  const userList: UsersDataWithRepos[] = JSON.parse(
    fs.readFileSync('results/userDataWithRepos.json', 'utf8')
  );

  if (userList === undefined || userList.length === 0) {
    console.error('유저 데이터가 없어요!');
    return;
  }

  const processedData = await processData(userList);

  saveToCSV({
    profiles: processedData,
    startIndex: Number(process.env.ID_PRESET || '58812280'),
    endIndex: userList[userList.length - 1].id,
  });
}

main().catch(console.error);
