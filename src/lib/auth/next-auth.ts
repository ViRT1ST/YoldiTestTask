import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import { AUTH_CONFIG, GITHUB_OAUTH_CONFIG, GOOGLE_OAUTH_CONFIG } from '@/constants/secret';

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
      clientId: GITHUB_OAUTH_CONFIG.clientId,
      clientSecret: GITHUB_OAUTH_CONFIG.clientSecret,
    }),
    Google({
      clientId: GOOGLE_OAUTH_CONFIG.clientId,
      clientSecret: GOOGLE_OAUTH_CONFIG.clientSecret,
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
        token = { ...session.user.replace_data };
      };

      return token;
		},
		async session({ session, token }) {
      if (session && token) {
        session.user = token as any;
      }

      return session;
		},
	},
  pages: {
    signIn: 'http://localhost:3000/yoldi/auth',
  },
  session: {
    strategy: 'jwt',  
  },
  basePath: AUTH_CONFIG.apiPath,
  secret: AUTH_CONFIG.secret,
};

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth(authOptions);

// console.log('[jwt] token:', token);
// console.log('[jwt] user:', user);
// console.log('[jwt] account:', account);
// console.log('[jwt] profile:', profile);
// console.log('[jwt] session:', session);
