'use client';

import { Provider } from 'react-redux';
import { useEffect, useState, ReactNode } from 'react';

import tw from 'tailwind-styled-components';

import Header from '@/components/yoldi/layout/Header';
import Footer from '@/components/yoldi/layout/Footer';
import store from '@/lib/frontend/store';

export default function ContentLayout({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Provider store={store}>
      <LayoutContainer>
        <Header />
        <Content>{children}</Content>
        <Footer />
      </LayoutContainer>
    </Provider>
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
