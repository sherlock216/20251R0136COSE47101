import {
  CSVInterface,
  isLanguage,
  LanguageCount,
  languages,
  UsersDataWithRepos,
} from '../types';

const processData = async (
  data: UsersDataWithRepos[]
): Promise<CSVInterface[]> => {
  const ret: CSVInterface[] = [];
  for (const user of data) {
    const languageCount: LanguageCount = {
      Assembly: 0,
      C: 0,
      'C++': 0,
      'C#': 0,
      Dart: 0,
      Go: 0,
      Java: 0,
      JavaScript: 0,
      Kotlin: 0,
      MATLAB: 0,
      PHP: 0,
      Python: 0,
      Ruby: 0,
      Rust: 0,
      Scala: 0,
      Swift: 0,
      TypeScript: 0,
    };
    for (const repo of user.repos) {
      if (repo.language && isLanguage(repo.language)) {
        languageCount[repo.language] += 1;
      }
    }

    const totalCount = Object.values(languageCount).reduce(
      (acc, curr) => acc + curr,
      0
    );
    if (totalCount > 0) {
      for (const lang of languages) {
        languageCount[lang] = Number(
          (languageCount[lang] / totalCount).toFixed(2)
        );
      }
    } else {
      continue;
    }

    ret.push({
      ...languageCount,
      username: user.login,
      userID: user.id,
      repoCount: user.repos.length,
    });
  }

  return ret;
};

export default processData;
