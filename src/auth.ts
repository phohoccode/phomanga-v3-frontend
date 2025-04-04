import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import { ZodError } from "zod";
import GoogleProvider from "next-auth/providers/google";
import axios from "@/components/config/axios";
import { codeErrorLogin } from "./lib/types";

export class InvalidLoginError extends AuthError {
  constructor(public code: codeErrorLogin, public details?: string) {
    super(details);
    this.code = code;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          const user: any = await axios.post("/auth/login", {
            email,
            password,
            typeAccount: "credentials",
          });

          if (user?.status === "error") {
            throw new InvalidLoginError(user?.error_code, user?.message);
          }

          return user;
        } catch (error) {
          // Nếu lỗi là ZodError, thì xử lý lỗi
          if (error instanceof ZodError) {
            throw new InvalidLoginError(
              "zod_error",
              error?.issues?.[0]?.message
            );
          }
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, profile, account }: any) {
      if (account?.provider === "google") {
        const query = `email=${profile?.email}&typeAccount=google`;
        const response: any = await axios.get(`/user/search?${query}`);

        if (!response?.user) {
          await axios.post("/auth/register", {
            email: profile?.email,
            name: profile?.name,
            avatar: profile?.picture,
            typeAccount: "google",
          });
        }

        token.type_account = "google";
        token.picture = profile?.picture;
      } else if (account?.provider === "credentials") {
        token.type_account = "credentials";
        token.picture = "/images/avatar.jpg";
      }

      const query = `email=${token?.email}&typeAccount=${
        account?.provider ?? token?.type_account
      }`;
      const response: any = await axios.get(`/user/info?${query}`);

      token.id = response?.user?.user_id;
      token.role = response?.user?.role_name;
      token.email = response?.user?.email;
      token.username = response?.user?.username;
      token.type_account = response?.user?.type_account;
      token.vip_level = response?.user?.vip_level;
      token.nickname = response?.user?.nickname;
      token.max_stories = response?.user?.max_stories;
      token.created_at = response?.user?.created_at;

      return token;
    },
    // nhận token từ jwt callback và trả về session
    async session({ session, token }: any) {
      session.user.id = token?.id ?? token?.sub;
      session.user.username = token.name;
      session.user.email = token.email;
      session.user.avatar = token.picture;
      session.user.role = token.role;
      session.user.vip_level = token.vip_level;
      session.user.nickname = token.nickname;
      session.user.max_stories = token.max_stories;
      session.user.type_account = token.type_account;
      session.user.created_at = token.created_at;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
