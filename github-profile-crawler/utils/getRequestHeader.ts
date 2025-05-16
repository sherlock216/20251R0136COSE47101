import 'dotenv/config';

const getRequestHeader = () => {
  return {
    method: 'GET',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
      Authorization: process.env.GITHUB_TOKEN
        ? `Bearer ${process.env.GITHUB_TOKEN}`
        : '',
      Accept: 'application/vnd.github+json',
    },
  };
};

export default getRequestHeader;
