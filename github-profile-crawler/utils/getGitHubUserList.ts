import 'dotenv/config';
import { GitHubUser } from '../types';

const fetchData = async (
  since: number,
  per_page: number
): Promise<GitHubUser[] | { message: string }> => {
  const response = await fetch(
    `https://api.github.com/users?since=${since}?per_page=${per_page}`,
    {
      method: 'GET',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        Authorization: process.env.GITHUB_TOKEN
          ? `Bearer ${process.env.GITHUB_TOKEN}`
          : '',
        Accept: 'application/vnd.github+json',
      },
    }
  );
  return response.json();
};

const ID_PRESET = parseInt(process.env.ID_PRESET || '58812280');

export const getGitHubUserList = async (dataSize: number) => {
  const profileData: GitHubUser[] = [];

  for (let i = 0; i < Math.floor(dataSize / 100); i++) {
    const data = await fetchData(ID_PRESET + i * 100, 100);
    if (typeof data === 'object' && 'message' in data) {
      console.log('API 호출 오류 발생: ' + data.message);
      return [];
    }
    profileData.push(...data);
  }

  const filteredData = profileData.filter(
    (user: GitHubUser) =>
      user.type === 'User' && user.user_view_type === 'public'
  );

  console.log(`${filteredData.length}개의 유저 데이터를 가져왔어요!`);

  return filteredData;
};
