'use client';

import { usePathname } from 'next/navigation';
import Layout from '@/app/components/Layout';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <>
      {isLandingPage ? (
        children
      ) : (
        <Layout>
          {children}
        </Layout>
      )}
    </>
  );
}
