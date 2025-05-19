import fs from 'fs';

import { getGitHubUserList } from './utils/getGitHubUserList';
import { ID_PRESET, DATA_SIZE } from './getEnv';

async function main() {
  console.log('🚀 유저 리스트를 가져와요!');

  const profileData = await getGitHubUserList(ID_PRESET, DATA_SIZE);

  console.log(`${profileData.length}개의 유저 데이터를 가져왔어요!`);

  // results/users.json 파일로 저장
  fs.writeFileSync(
    `results/users_v2_${ID_PRESET}_${ID_PRESET + DATA_SIZE}.json`,
    JSON.stringify(profileData, null, 2)
  );
}

main().catch(console.error);
