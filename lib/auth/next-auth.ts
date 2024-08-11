import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import { authOrRegisterUser, modifyToken, modifySession } from '@/lib/auth/helpers';

export const BASE_PATH = '/api/auth';

const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<object | null> {
        return credentials;
      }
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      const result = await authOrRegisterUser(account, profile, credentials);
      return result;
    },
    async jwt({ token, user, account, profile }) {
      await modifyToken(token, account, profile);
      return token;
		},
		async session({ session, token, user }): Promise<any> {
      await modifySession(session, token);
      return session;
		},
	},
  pages: {
    signIn: '/yoldi/auth',
  },
  basePath: BASE_PATH,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',  
  },  
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

// console.log('[jwt] token:', token);
// console.log('[jwt] user:', user);
// console.log('[jwt] account:', account);
// console.log('[jwt] profile:', profile);
// console.log('[session] session:', session);
// console.log('[session] token:', token);
// console.log('[session] user:', user);