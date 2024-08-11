import tw from 'tailwind-styled-components';

import Header from '@/components/yoldi-common/header';
import Footer from '@/components/yoldi-common/footer';

interface YoldiLayoutProps {
  children: React.ReactNode;
}

export default function YoldiLayout({ children }: YoldiLayoutProps) {
  return (
    <Container>
      <Header />

      <Main>
        {children}
      </Main>

      <Footer />
    </Container>
  );
}

const Container = tw.div`
  w-full h-full min-h-screen
  flex flex-col
  font-inter
`;

const Main = tw.div`
  flex-grow flex 
  bg-[#F3F3F3]
  bg-transparent xs:bg-[#F3F3F3]
`;
