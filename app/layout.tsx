import React from 'react';

export const metadata = {
  title: 'The Experience Project',
  description: '타인을 이해하는 경험 프로젝트',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
