import { CSVInterface, languages } from '../types';
import * as fs from 'fs';
import * as path from 'path';

interface SaveToCSVProps {
  profiles: CSVInterface[];
  startIndex: number;
  endIndex: number;
}
export const saveToCSV = async ({
  profiles,
  startIndex,
  endIndex,
}: SaveToCSVProps) => {
  // 헤더 열 정의
  let csvContent = `유저 ID, ${languages.join(', ')}\n`;

  // 프로필 추가
  for (const profile of profiles) {
    const row = [
      profile.username,
      ...languages.map(language => profile[language]),
    ].join(',');
    csvContent += `${row}\n`;
  }

  // root 디렉토리에 저장하기
  const filePath = path.join(
    `./results/github_profiles_${startIndex}-${endIndex}.csv`
  );

  fs.writeFileSync(filePath, csvContent);

  console.log(`CSV file이 저장되었어요! : ${filePath}`);
};
