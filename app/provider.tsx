// app/providers.tsx

'use client'

import { AuthProvider } from '@/contexts/AuthContex'

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}