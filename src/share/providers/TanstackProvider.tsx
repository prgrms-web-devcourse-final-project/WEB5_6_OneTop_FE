"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function TanstackProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 5,
            retry: 2,
            refetchIntervalInBackground: false,
            retryDelay: 1000,
          },
          mutations: {
            retry: 2,
            retryDelay: 1000,
          }
        },
      })
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools client={queryClient} />
      </QueryClientProvider>
    </>
  );
}

export default TanstackProvider;
