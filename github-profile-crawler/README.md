# Crawler for Data Science Assignment

## 사용법

- 터미널에 `npm i`을 입력해서 필요한 라이브러리를 설치합니다
- .env 파일 만들어서 요렇게 작성해주세요. (따옴표 없어도 됨, 디폴트 값 있어서 딱히 설정 안해도 됨)
- GITHUB_TOKEN에는 개인 깃허브 Access Token 넣으면 돼요. (절대 유출되면 안됨)
- DATA_SIZE에는 가지고 오고 싶은 프로필 개수 적으면 됩니당. (유령 계정 많아서 실제론 적은거보다 훨씬 적게 가지고옴. API 호출 개수랑 비례해지므로 6000개 정도 적정)
- ID_PRESET에는 탐색을 시작하는 ID(숫자)를 적으면 돼요. default값은 halionaz 계정으로 되어있음요

```txt
GITHUB_TOKEN=somethingsomething
DATA_SIZE=100
ID_PRESET=100000000
```

- 그담에 `npm run start` ㄱㄱ

## 전반적 프로세스

1.  크롤링 할 유저 리스트업
2.  가지고 온 데이터만으로 일단 유저 가지치기
    (node_id, id 기준 너무 옛날 유저, 유저 타입 organization 제외)

## Github Profile Elements

- username
- README.md String
- 유저가 등록한 Top Repositories (가중치 적용?)
  - Repository's Language Data
  - 패키지가 있다면 package Data
- 유저가 활동한 Repositories 상위 5개
  - Repository's Language Data
  - 패키지가 있다면 package Data
- Stars 표시한 레포지토리 상위 5개
- 팔로잉 유저 목록
- 팔로워 유저 목록

## For What

- 유저 스택 분류
- 개발 경력 (연차)
- Nonsense
  - MBTI 예측
