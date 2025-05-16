import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🚀 CSV 파일들을 합치는 중이에요!');

  const resultsDir = 'results';
  const outputFile = path.join(resultsDir, 'github_profiles.csv');

  // results 디렉토리에서 github_profiles로 시작하는 CSV 파일들을 찾습니다
  const files = fs
    .readdirSync(resultsDir)
    .filter(
      file => file.startsWith('github_profiles') && file.endsWith('.csv')
    );

  if (files.length === 0) {
    console.error('합칠 CSV 파일이 없어요!');
    return;
  }

  // 첫 번째 파일의 헤더를 저장합니다
  const headerFile = fs.readFileSync(path.join(resultsDir, files[0]), 'utf8');
  const header = headerFile.split('\n')[0];

  // 결과 파일에 헤더를 씁니다
  fs.writeFileSync(outputFile, header + '\n');

  // 각 파일의 내용을 합칩니다 (헤더 제외)
  for (const file of files) {
    const content = fs.readFileSync(path.join(resultsDir, file), 'utf8');
    const lines = content.split('\n').slice(1); // 헤더를 제외한 라인들

    // 빈 라인 제외하고 파일에 추가
    const validLines = lines.filter(line => line.trim() !== '');
    if (validLines.length > 0) {
      fs.appendFileSync(outputFile, validLines.join('\n') + '\n');
    }
  }

  console.log(`✅ ${files.length}개의 파일을 성공적으로 병합했어요!`);
  console.log(`📄 결과 파일: ${outputFile}`);
}

main().catch(console.error);
