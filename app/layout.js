export const metadata = {
  title: 'Contact Management System',
  description: 'A comprehensive contact management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}