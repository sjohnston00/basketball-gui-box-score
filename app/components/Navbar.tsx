import { NavLink as RemixNavLink } from '@remix-run/react'
import { RemixLinkProps } from '@remix-run/react/dist/components'
import { twMerge } from 'tailwind-merge'

export default function Navbar() {
  return (
    <nav className="flex items-center mb-4">
      <NavLink to={'/'}>Home</NavLink>
      <NavLink to={'/teams'}>Teams</NavLink>
      <NavLink to={'/games'}>Games</NavLink>
      <NavLink to={'/players'}>Players</NavLink>
    </nav>
  )
}

type NavLinkProps = RemixLinkProps

function NavLink({ children, to, className }: NavLinkProps) {
  return (
    <RemixNavLink
      className={({ isActive }) =>
        twMerge(
          'p-4 no-underline border-b-2',
          isActive ? 'border-b-indigo-600' : 'border-b-transparent',
          className
        )
      }
      to={to}
    >
      {children}
    </RemixNavLink>
  )
}
