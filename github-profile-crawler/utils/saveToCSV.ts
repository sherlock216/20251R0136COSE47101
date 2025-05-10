import { GitHubProfile } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export const saveToCSV = async (profiles: GitHubProfile[]) => {
  // 헤더 열 정의
  let csvContent =
    '유저 ID,팔로워 수,팔로잉 수,README,스타 표시한 레포지토리\n';

  // 프로필 추가
  for (const profile of profiles) {
    // CSV 이슈 방지를 위해 readme와 starredRepos를 sanitize
    // TODO: 뭔가 뭔가 따옴표가 제대로 처리 안되는거 같긴 한데 나중에 다시 점검하기
    const sanitizedReadme = profile.readme
      .replace(/"/g, '""')
      .replace(/\n/g, ' ');
    const sanitizedStarredRepos = profile.starredRepos
      .join(', ')
      .replace(/"/g, '""');

    csvContent += `"${profile.username}",${profile.followers},${profile.following},"${sanitizedReadme}","${sanitizedStarredRepos}"\n`;
  }

  // root 디렉토리에 저장하기
  const filePath = path.join('./github_profiles.csv');
  fs.writeFileSync(filePath, csvContent);
  console.log(`CSV file이 저장되었어요! : ${filePath}`);
};
