import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import validator from '@/lib/backend/validator';
// import bcrypt from '@/lib/backend/utils/bcrypt';
// import db from '@/lib/backend/postgres';
import { getUserByEmail } from '@/lib/backend/__test';



export const BASE_PATH = '/api/auth';

const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<object | null> {
        const { username, password } = credentials;

        // const validEmail = validator.assertEmail(username);
        // const validPassword = validator.assertPassword(password);



        const user = await getUserByEmail(username);
    
        // const user = await pg.getUserByEmail(validEmail);

        // if (!user) {
        //   return null;
        // }
    
        // bcrypt.checkPassword(validPassword, user.password);

        // return {
        //   id: user.uuid,
        //   email: user.email,
        //   name: user.username,
        // };

        return { id: 'user1', name: 'James', email: 'email@gmail.com' };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
			return token;
		},
		async session({ session, token }): Promise<any> {
			return {
        ...session,
        user: {
          ...session.user,
          id: token.sub
        }
      };
		},
	},

  pages: {
    signIn: '/yoldi/auth',
  },
  basePath: BASE_PATH,
  secret: process.env.NEXT_AUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
