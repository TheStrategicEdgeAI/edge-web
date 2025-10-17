import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import EdgeChat from '../components/EdgeChat';

export default function EdgeApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      {/* Global navigation bar displayed on every page */}
      <NavBar />
      <Component {...pageProps} />
      {/* Global chat bubble for quick help */}
      <EdgeChat />
    </AuthProvider>
  );
}
