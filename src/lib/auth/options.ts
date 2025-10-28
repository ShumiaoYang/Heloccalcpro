import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';

function getEnv(name: 'GOOGLE_CLIENT_ID' | 'GOOGLE_CLIENT_SECRET' | 'NEXTAUTH_SECRET') {
  const value = process.env[name];
  if (value) return value;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${name} 未配置，无法初始化认证。`);
  }
  return `placeholder-${name.toLowerCase()}`;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: getEnv('NEXTAUTH_SECRET'),
  session: {
    strategy: 'database',
  },
  providers: [
    GoogleProvider({
      clientId: getEnv('GOOGLE_CLIENT_ID'),
      clientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = user?.id ?? (typeof token?.sub === 'string' ? token.sub : session.user.id ?? '');
        session.user.name = user?.name ?? session.user.name;
        session.user.email = user?.email ?? session.user.email;
        session.user.image = user?.image ?? session.user.image;
      }
      return session;
    },
  },
};
