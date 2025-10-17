// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Project Chronos',
  description: 'AI Archaeologist Mission Control',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1F2937', // gray-800
              color: '#F9FAFB',     // gray-50
              border: '1px solid #4B5563', // gray-600
            },
          }}
        />
      </body>
    </html>
  )
}