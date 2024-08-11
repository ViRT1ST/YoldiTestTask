import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import { NEXTAUTH_API_PATH } from '@/constants';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  throw new Error('Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET');
}

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

if (!NEXTAUTH_SECRET) {
  throw new Error('Missing NEXTAUTH_SECRET');
}

const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        name: { label: 'Name', type: 'name' },
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<object | null> {
        return credentials;
      },
    }),
    GitHub({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      if (token && user) {
        token.provider_data = user as any;
      }

      if (token && profile) {
        token.provider_data = profile as any;
      }

      if (token && account) {
        token.iss = account.provider;
      }

      if (trigger === 'update' && session) {
        token = { ...token, ...session.user };
      };

      return token;
		},
		async session({ session, token }): Promise<any> {
      if (session && token) {
        session.user = token as any;
      }

      return session;
		},
	},
  pages: {
    signIn: '/yoldi/auth',
  },
  session: {
    strategy: 'jwt',  
  },
  basePath: NEXTAUTH_API_PATH,
  secret: NEXTAUTH_SECRET,
};

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth(authOptions);

// console.log('[jwt] token:', token);
// console.log('[jwt] user:', user);
// console.log('[jwt] account:', account);
// console.log('[jwt] profile:', profile);
// console.log('[jwt] session:', session);
