'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HOME_PATH } from '@/path';

export default function RedirectHome() {
  const router = useRouter();

  useEffect(() => {
    router.push(HOME_PATH);
  }, []);

  return null; 
}
