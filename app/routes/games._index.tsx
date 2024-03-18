import { Form, Link } from '@remix-run/react'

export default function Page() {
  return (
    <div>
      <h1>Games</h1>
      <ul>
        <li>
          <Link to="/games/new">New Game</Link>
        </li>
      </ul>
      <table>
        <thead>
          <tr>
            <th>Home</th>
            <th>Score</th>
            <th>Score</th>
            <th>Away</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Link to={`/games/${1}`}>Test</Link>
            </td>
            <td>
              <Link to={`/games/${1}`}>Test</Link>
            </td>
            <td>
              <Link to={`/games/${1}`}>Test</Link>
            </td>
            <td>
              <Link to={`/games/${1}`}>Test</Link>
            </td>
            <td>
              <Link to={`/games/${1}`}>Test</Link>
            </td>
            <td>
              <div className="flex items-center gap-2">
                <Link to={`/games/${1}`}>Edit</Link>
                <Form method="delete">
                  <input type="hidden" name="gameId" value={1} />
                  <button>Delete</button>
                </Form>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
