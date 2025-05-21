import fs from 'fs';

import { UsersDataWithRepos } from './types';
import processData from './utils/processData';
import { saveToCSV } from './utils/saveToCSV';
import { DATA_SIZE, ID_PRESET } from './getEnv';

async function main() {
  console.log('🚀 CSV파일을 생성해요!');

  const userList: UsersDataWithRepos[] = JSON.parse(
    fs.readFileSync(
      `results/userDataWithRepos_v2_${ID_PRESET}_${ID_PRESET + DATA_SIZE}.json`,
      'utf8'
    )
  );

  if (userList === undefined || userList.length === 0) {
    console.error('유저 데이터가 없어요!');
    return;
  }

  const processedData = await processData(userList);

  saveToCSV({
    profiles: processedData,
    startIndex: ID_PRESET,
    endIndex: userList[userList.length - 1].id,
  });
}

main().catch(console.error);
