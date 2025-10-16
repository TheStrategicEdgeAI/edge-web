import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

/**
 * Custom App component. Wraps the entire application in a SessionProvider so
 * authentication state is available across all pages. Any additional providers
 * (e.g. theme providers) should be added here as well.
 */
export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
