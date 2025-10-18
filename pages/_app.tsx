import type { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';

// Basic app wrapper with AuthProvider.  In a full implementation you
// might also include global CSS and other context providers here.
export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}