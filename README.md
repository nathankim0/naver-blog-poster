# Naver Blog Poster

마크다운으로 네이버 블로그에 글을 발행하는 웹 도구

## 기능

- 네이버 OAuth 로그인
- 마크다운 에디터 (실시간 미리보기)
- `.md` 파일 드래그앤드롭 불러오기
- 이미지 첨부 (드래그앤드롭 / 파일 선택)
- 카테고리 선택 & 공개 설정

## 시작하기

### 1. 네이버 개발자 센터 앱 등록

[developers.naver.com](https://developers.naver.com)에서 애플리케이션 등록:

- **사용 API**: 네이버 아이디로 로그인 + 블로그
- **Callback URL**: `http://localhost:3000/api/auth/callback/naver` (개발용)

### 2. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local`을 편집하여 값을 채워주세요:

```
NAVER_CLIENT_ID=발급받은_클라이언트_ID
NAVER_CLIENT_SECRET=발급받은_클라이언트_시크릿
NEXTAUTH_SECRET=임의의_시크릿_문자열
NEXTAUTH_URL=http://localhost:3000
```

### 3. 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속

## 배포 (Vercel)

1. GitHub에 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 import
3. 환경 변수 설정 (위 4개 값)
4. 네이버 개발자 센터에서 Callback URL에 `https://your-domain.vercel.app/api/auth/callback/naver` 추가

## 기술 스택

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- NextAuth.js (네이버 OAuth)
- @uiw/react-md-editor
- markdown-it
