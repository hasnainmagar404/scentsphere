import './globals.css'

export const metadata = {
  title: 'ScentSphere - Discover Your Signature Scent',
  description: 'Discover your perfect fragrance with ScentSphere. Find your signature scent through personalized perfume recommendations.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
