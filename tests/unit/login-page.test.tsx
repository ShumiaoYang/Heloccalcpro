import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import LoginPageClient from '@/app/[locale]/auth/login/page.client';
import { signIn } from 'next-auth/react';
import enMessages from '../../content/en.json';

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, ...props }: { children: React.ReactNode }) => <a {...props}>{children}</a>,
}));

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

describe('LoginPage', () => {
  it('renders headline and description', () => {
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <LoginPageClient />
      </NextIntlClientProvider>,
    );

    expect(screen.getByText('Sign in to your HELOC Calculator account')).toBeInTheDocument();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  it('triggers Google sign-in when clicking the button', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <LoginPageClient />
      </NextIntlClientProvider>,
    );

    const button = screen.getByRole('button', { name: 'Continue with Google' });
    fireEvent.click(button);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('google', { callbackUrl: '/en' });
    });
  });
});
