import { DocsLayout } from 'onedocs-next';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import config from '../../../onedocs.config';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout config={config} pageTree={source.pageTree}>
      {children}
    </DocsLayout>
  );
}
