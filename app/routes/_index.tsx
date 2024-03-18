import { Link } from '@remix-run/react'

export const meta = () => {
  return [
    { title: 'New Remix SPA' },
    { name: 'description', content: 'Welcome to Remix (SPA Mode)!' },
  ]
}

export default function Index() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/teams">Teams</Link>
        </li>
        <li>
          <Link to="/players">Players</Link>
        </li>
        <li>
          <Link to="/games">Games</Link>
        </li>
      </ul>
    </div>
  )
}

