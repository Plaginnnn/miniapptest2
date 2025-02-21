import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import { Root } from '@/components/Root/Root';

import '@telegram-apps/telegram-ui/dist/styles.css';
// Remove normalize.css as it might conflict with Telegram UI styles
// import 'normalize.css/normalize.css';
import './_assets/globals.css';

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Your Application Title Goes Here',
  description: 'Your application description goes here',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={poppins.variable}>
      <body style={{ margin: 0, padding: 0, paddingBottom: '60px' }}>
        <Root>
          {children}
        </Root>
      </body>
    </html>
  );
}
