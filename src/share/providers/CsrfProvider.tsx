"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CsrfContextType {
  csrfToken: string | null;
}

const CsrfContext = createContext<CsrfContextType | undefined>(undefined);

export const useCsrfToken = () => {
  const context = useContext(CsrfContext);
  if (!context) {
    throw new Error('useCsrfToken must be used within a CsrfProvider');
  }
  return context.csrfToken;
};

export const CsrfProvider = ({ children }: { children: ReactNode }) => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf-token');
        if (response.ok) {
          const data = await response.json();
          setCsrfToken(data.token);
        }
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  return (
    <CsrfContext.Provider value={{ csrfToken }}>
      {children}
    </CsrfContext.Provider>
  );
};
