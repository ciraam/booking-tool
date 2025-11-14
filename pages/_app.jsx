import { Toaster } from "../components/ui/toaster.jsx";
import { Toaster as Sonner } from "../components/ui/sonner.jsx";
import { TooltipProvider } from "../components/ui/tooltip.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { store } from "../store/store.js";
import "../styles/index.css";

const queryClient = new QueryClient();

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            {/* Notifications */}
            <Toaster />
            <Sonner />

            {/* Pages */}
            <Component {...pageProps} />
          </TooltipProvider>
        </QueryClientProvider>
      </Provider>
    </SessionProvider>
  );
}