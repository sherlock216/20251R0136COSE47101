import 'dotenv/config';
import { GitHubUser } from '../types';
import getRequestHeader from './getRequestHeader';

const fetchData = async (
  since: number,
  per_page: number
): Promise<GitHubUser[] | { message: string }> => {
  const response = await fetch(
    `https://api.github.com/users?since=${since}&per_page=${per_page}`,
    getRequestHeader()
  );
  return response.json();
};

export const getGitHubUserList = async (preset: number, dataSize: number) => {
  const profileData: GitHubUser[] = [];
  let lastIndex = preset;

  for (let i = 0; i < Math.floor(dataSize / 100); i++) {
    const data = await fetchData(lastIndex, 100);
    if (typeof data === 'object' && 'message' in data) {
      console.log('API 호출 오류 발생: ' + data.message);
      return [];
    }
    lastIndex = data[data.length - 1].id;
    profileData.push(...data);
  }
  if (dataSize % 100 !== 0) {
    const data = await fetchData(lastIndex, dataSize % 100);
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

  return filteredData;
};
