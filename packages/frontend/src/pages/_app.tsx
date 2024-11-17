import '../styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SocketProvider } from '../context/SocketContext';
import { P2PProvider } from '../context/P2PContext';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <P2PProvider>
          <Component {...pageProps} />
        </P2PProvider>
      </SocketProvider>
    </QueryClientProvider>
  );
}

export default MyApp;