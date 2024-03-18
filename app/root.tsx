import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import './styles.css'
import Navbar from './components/Navbar'
import { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => [
  {
    title: 'Basketball Stats',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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

