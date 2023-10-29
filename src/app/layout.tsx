"use client"

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Provider } from 'react-redux'
import {store} from "./hooks/store"
const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
    <html lang="en">
      <Provider store={store}>
      <body className="h-screen">{children}</body>
      </Provider>
     
    </html>
  )
}