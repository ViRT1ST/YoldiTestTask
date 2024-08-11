import { Open_Sans, Lato, Roboto, Inter } from 'next/font/google';

import '@/assets/styles/globals.css';

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

export const metadata = {
  title: 'News Collector 6.0',
};

export default function RootLayout({ children } : { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${open_sans.variable} ${lato.variable} ${roboto.variable} ${inter.variable}`}
    >
      <body className="relative">
        {children}
        <div id="modal-container" className="absolute top-0 left-0 w-full" />
      </body>
    </html>
  );
}
