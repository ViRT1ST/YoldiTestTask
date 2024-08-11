'use client';

import { Provider } from 'react-redux';
import { useEffect, useState, ReactNode } from 'react';
import tw from 'tailwind-styled-components';

import Header from '@/components/yoldi/Header';
import Footer from '@/components/yoldi/Footer';
import store from '@/lib/frontend/store';

import SessionProvider from '@/components/SessionProvider';


export default function ContentLayout({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <SessionProvider>
      <Provider store={store}>
        <LayoutContainer>
          <Header />
          <Content>{children}</Content>
          <Footer />
        </LayoutContainer>
      </Provider>
    </SessionProvider>
  );
}

const LayoutContainer = tw.div`
  w-full h-full min-h-screen
  flex flex-col
  font-inter
`;

const Content = tw.div`
  flex-grow flex 
  bg-[#F3F3F3]
  bg-transparent xs:bg-[#F3F3F3]
`;
