# Naver Blog Poster

마크다운으로 네이버 블로그에 글을 발행하는 도구

## 원커맨드 시작

```bash
npx naver-blog-poster
```

이게 전부입니다. 터미널이 안내하는 대로 따라하면 됩니다:

1. 네이버 개발자 센터가 브라우저에 열림
2. 앱 등록 후 Client ID / Secret을 터미널에 붙여넣기
3. 자동으로 설정 완료 + 서버 시작
4. http://localhost:3000 에서 네이버 로그인 후 글 작성

## 기능

- 마크다운 에디터 (실시간 미리보기)
- Ctrl+V 이미지 붙여넣기 (본문에 자동 삽입)
- .md 파일 드래그앤드롭 불러오기
- 이미지 드래그앤드롭 / 파일 선택
- 로컬스토리지 임시 저장 (창 닫아도 복원)
- Ctrl+Enter 빠른 발행
- 카테고리 선택 & 공개 설정

## 수동 설정

이미 클론한 경우:

```bash
npm run setup
```

또는 직접 설정:

```bash
cp .env.example .env.local
# .env.local 편집 후
npm install && npm run dev
```

## 네이버 앱 등록 시 설정값

| 항목 | 값 |
|------|-----|
| 사용 API | 네이버 아이디로 로그인 + 블로그 |
| 서비스 URL | http://localhost:3000 |
| Callback URL | http://localhost:3000/api/auth/callback/naver |

## 배포 (Vercel)

1. GitHub에 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 import
3. 환경 변수 4개 설정
4. 네이버 Callback URL에 `https://your-domain.vercel.app/api/auth/callback/naver` 추가

## 기술 스택

Next.js 16 / TypeScript / Tailwind CSS / NextAuth.js / @uiw/react-md-editor / markdown-it
