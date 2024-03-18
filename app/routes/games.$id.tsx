import { Link, useParams } from '@remix-run/react'

export default function Page() {
  const { id } = useParams()
  return (
    <div>
      <h1>Games</h1>
      <span>Game ID: {id}</span>
      <ul>
        <li>
          <Link to="/games">back</Link>
        </li>
      </ul>
    </div>
  )
}
