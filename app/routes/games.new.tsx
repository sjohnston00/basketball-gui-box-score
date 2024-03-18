import { Link } from '@remix-run/react'

export default function Page() {
  return (
    <div>
      <h1>Games</h1>
      <h2>New Game</h2>
      <ul>
        <li>
          <Link to="/games">back</Link>
        </li>
      </ul>
    </div>
  )
}
