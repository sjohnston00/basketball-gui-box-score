import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import './styles.css'
import Navbar from './components/Navbar'
import { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => [
  {
    title: 'Basketball Stats',
    charSet: 'utf-8',
    viewport: 'width=device-width, initial-scale=1',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans px-2">
        <Navbar />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function HydrateFallback() {
  return <p>Loading...</p>
}

