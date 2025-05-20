# Crawler for Data Science Assignment

## 사용법

- 터미널에 `npm i`을 입력해서 필요한 라이브러리를 설치합니다
- .env 파일 만들어서 요렇게 작성해주세요. (따옴표 없어도 됨, 디폴트 값 있어서 딱히 설정 안해도 됨)
- GITHUB_TOKEN에는 개인 깃허브 Access Token 넣으면 돼요. (절대 유출되면 안됨)
- DATA_SIZE에는 가지고 오고 싶은 프로필 개수 적으면 됩니당. (한 번 돌릴 때 1000개 정도 적정, 대충 수율 7% 정도 나오는 듯)
- ID_PRESET에는 탐색을 시작하는 ID(숫자)를 적으면 돼요. default값은 halionaz 계정으로 되어있음요

```txt
GITHUB_TOKEN=somethingsomething
DATA_SIZE=100
ID_PRESET=50000000
```

- `npm run get-users` ㄱㄱ
- `npm run get-repos` ㄱㄱ (위에꺼 먼저 해야됨)
- `npm run get-csv` ㄱㄱ (위에꺼 두개 먼저 해야됨)
- 세 번 연달아 입력하기 귀찮으면 `npm run start` 입력하면 알아서 해줌

## 전반적 프로세스 (v1)

1.  `npm run get-users` 하면 크롤링 할 유저 리스트업. ID_PRESET으로 부터 DATA_SIZE만큼의 유저를 긁어옴
2.  유저 타입 organization이면 제외하고 `users.json`으로 저장함
3.  각 유저별로 반복 돌면서 그 사람 레포지토리랑 Star 표시 레포지토리 긁어옴. 이때 레포는 크기가 500 이상인 것만 수집.
4.  만약에 본인 레포가 3개 미만이면 컷, `userDataWithRepos.json`으로 저장
5.  여기까지 남은 유저들을 순회하면서 그 사람의 언어 비율 통계를 냄. 만약에 우리가 수집하는 언어를 전혀 안 쓴 사람이면 컷.
6.  CSV 파일로다가 `github_profiles_{id 구간}`으로 저장됨

## 전반적 프로세스 (v2)

1.  크롤링 할 유저 리스트업. ID_PRESET으로 부터 DATA_SIZE만큼의 유저를 긁어옴
2.  유저 타입 organization이면 제외하고 `users_v2_{id 구간}.json`으로 저장함
3.  각 유저별로 반복 돌면서 그 사람 레포지토리 긁어옴. 이때 레포는 크기가 500 이상이고 우리가 수집하는 언어에 해당하는 것만 수집.
4.  만약에 이렇게 긁어온 레포가 3개 미만이면 컷, `userDataWithRepos_v2_{id 구간}.json`으로 저장
5.  여기까지 남은 유저들을 순회하면서 그 사람의 언어 비율 통계를 냄.
6.  CSV 파일로다가 `github_profiles_v2_{id 구간}`으로 저장됨

## CSV Elements

- username
- 각 언어별 유저 사용 빈도 (17가지 언어 크롤링)

### 언어 목록

- Assembly
- C
- C++
- C#
- Dart
- Go
- Java
- JavaScript
- Kotlin
- MATLAB
- PHP
- Python
- Ruby
- Rust
- Scala
- Swift
- TypeScript

## For What

- 유저 스택 분류
