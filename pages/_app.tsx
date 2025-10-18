import type { AppProps } from 'next/app';
import { ChatProvider } from '@/context/ChatContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChatProvider>
      <Component {...pageProps} />
    </ChatProvider>
  );
}
