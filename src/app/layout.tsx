import type { Metadata } from 'next';
import './globals.css';
import { InstrucoesDownload } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Followers and Unfollowers',
  description:
    'Compare seguidores e seguidos do Instagram para descobrir quem deixou de te seguir.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        {children}
        <InstrucoesDownload />
      </body>
    </html>
  );
}
