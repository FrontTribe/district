import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Room - 3D Visualization Studio Demo',
  description: '3D visualization services for architects, designers, and real estate developers',
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children
}
