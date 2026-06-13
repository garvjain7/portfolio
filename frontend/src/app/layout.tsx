import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Garv Jain — Backend & AI Engineer',
  description:
    'Engineering workspace of Garv Jain. Backend systems, AI integrations, and product-focused full-stack development.',
  keywords: [
    'Garv Jain',
    'Backend Engineer',
    'AI Engineer',
    'Full Stack Developer',
    'React',
    'FastAPI',
    'Node.js',
    'PostgreSQL',
  ],
  authors: [{ name: 'Garv Jain' }],
  openGraph: {
    title: 'Garv Jain — Backend & AI Engineer',
    description: 'Engineering workspace of Garv Jain.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}