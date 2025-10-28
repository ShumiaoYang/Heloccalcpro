import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

function getEnv(name: 'GOOGLE_CLIENT_ID' | 'GOOGLE_CLIENT_SECRET' | 'NEXTAUTH_SECRET') {
  const value = process.env[name];
  if (value) return value;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${name} 未配置，无法初始化认证。`);
  }
  return `placeholder-${name.toLowerCase()}`;
}

export const authOptions: NextAuthOptions = {
  secret: getEnv('NEXTAUTH_SECRET'),
  providers: [
    GoogleProvider({
      clientId: getEnv('GOOGLE_CLIENT_ID'),
      clientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as typeof session.user & { id?: string }).id = token.sub;
      }
      return session;
    },
  },
};
