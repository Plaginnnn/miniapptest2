'use client';

import { FC, useEffect } from 'react';
import { fixIosViewport } from '@/utils/fixIosViewport';
import { Header } from '@/components/common/Header';

const Home: FC = () => {
  useEffect(() => {
    fixIosViewport();
  }, []);

  return (
    <>
      <Header />
      <main>
        {/* Main content goes here */}
      </main>
    </>
  );
};

export default Home;
