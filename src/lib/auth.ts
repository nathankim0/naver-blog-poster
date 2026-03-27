import type { AuthOptions } from "next-auth";

const NAVER_AUTH_URL = "https://nid.naver.com/oauth2.0/authorize";
const NAVER_TOKEN_URL = "https://nid.naver.com/oauth2.0/token";
const NAVER_PROFILE_URL = "https://openapi.naver.com/v1/nid/me";

export const authOptions: AuthOptions = {
  providers: [
    {
      id: "naver",
      name: "Naver",
      type: "oauth",
      authorization: {
        url: NAVER_AUTH_URL,
        params: { response_type: "code" },
      },
      token: NAVER_TOKEN_URL,
      userinfo: NAVER_PROFILE_URL,
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      profile(profile) {
        const response = profile.response;
        return {
          id: response.id,
          name: response.nickname,
          email: response.email,
          image: response.profile_image,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
