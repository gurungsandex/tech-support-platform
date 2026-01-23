import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tech Support Platform - Connect with Verified IT Professionals',
  description: 'A secure, privacy-first platform connecting end users with verified IT professionals for real-time technical support.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
