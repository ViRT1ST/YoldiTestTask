import { Open_Sans, Lato, Roboto, Inter } from 'next/font/google';

import ToastifyContainer from '@/components/[body-children]/toastify-container';
import ModalContaner from '@/components/[body-children]/modal-container';
import BodyProviders from '@/components/[body-children]/body-providers';

import './globals.css';

export const metadata = {
  title: 'Yoldi Test Task Project'
};

const open_sans = Open_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['300'],
  display: 'swap',
  variable: '--font-open-sans',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-lato',
});

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-roboto',
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-inter',
});

const rootLayoutClasses = [
  open_sans.variable,
  lato.variable,
  roboto.variable,
  inter.variable
];

type Props = {
  children: JSX.Element;
};

export default function RootLayout({ children } : Props) {
  return (
    <html lang="en" className={rootLayoutClasses.join(' ')}>
      <body className="relative">
        <BodyProviders>
          {children}
          <ToastifyContainer />
          <ModalContaner />
        </BodyProviders>
      </body>
    </html>
  );
}
