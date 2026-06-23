import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CRM System - Manage Your Customer Relationships',
  description: 'Professional CRM software for managing leads, deals, and customer relationships',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-slate-900">
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
