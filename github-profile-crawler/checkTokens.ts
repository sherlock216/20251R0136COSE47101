import { GitHubUser } from './types';
import getRequestHeader from './utils/getRequestHeader';

const fetchData = async (): Promise<{
  remaining: string | null;
  reset: string | null;
}> => {
  const response = await fetch(
    `https://api.github.com/users`,
    getRequestHeader()
  );
  return {
    remaining: response.headers.get('x-ratelimit-remaining'),
    reset: response.headers.get('x-ratelimit-reset'),
  };
};

const main = async () => {
  const data = await fetchData();
  const remainCall = Number(data.remaining) - 1;
  const candidateDataSize = Math.floor((100 / 101) * (remainCall - 1));

  console.log(`${data.remaining}개의 API 호출 기회가 남아있어요!`);
  console.log(`${candidateDataSize}개의 API 호출 기회가 남아있어요!`);
  console.log(
    `${new Date(Number(data.reset) * 1000).toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
    })}에 리셋될 예정이에요!`
  );
};

main();
