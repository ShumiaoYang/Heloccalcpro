import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import { getActiveSubscription } from '@/lib/billing/service';

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
      const tokenUserId = typeof token?.sub === 'string' ? token.sub : undefined;
      const currentUserId = user?.id ?? session.user?.id ?? tokenUserId;

      const prismaUser =
        !user && currentUserId ? await prisma.user.findUnique({ where: { id: currentUserId } }) : null;
      const effectiveUser = user ?? prismaUser;

      const activeSubscription = currentUserId ? await getActiveSubscription(currentUserId) : null;

      if (session.user) {
        session.user.id = currentUserId ?? session.user.id ?? '';
        session.user.name = effectiveUser?.name ?? session.user.name;
        session.user.email = effectiveUser?.email ?? session.user.email;
        session.user.image = effectiveUser?.image ?? session.user.image;
        session.user.stripeCustomerId =
          effectiveUser && 'stripeCustomerId' in effectiveUser
            ? (effectiveUser as { stripeCustomerId: string | null }).stripeCustomerId ?? null
            : null;
        session.user.subscription = activeSubscription
          ? { planSlug: activeSubscription.plan.slug, status: activeSubscription.status }
          : { planSlug: null, status: null };
      }

      return session;
    },
  },
};
