import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      stripeCustomerId?: string | null;
      subscription?: {
        planSlug: string | null;
        status: string | null;
      };
    };
  }

  interface User {
    id: string;
    stripeCustomerId?: string | null;
  }
}
