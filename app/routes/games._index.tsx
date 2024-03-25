import { ClientActionFunctionArgs, Form, Link, useLoaderData } from '@remix-run/react'
import { deleteGame, getGames } from '~/utils/games'

export const clientLoader = async () => {
  const games = await getGames()
  return {
    games,
  }
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  if (!confirm('Are you sure you want to delete this game?')) return null
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  const gameId = data.gameId.toString().trim()

  await deleteGame(gameId)
  return null
}

export default function Page() {
  const { games } = useLoaderData<typeof clientLoader>()
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
          {games.map((game) => (
            <tr key={game.id}>
              <td>
                <Link to={`/teams/${game.homeTeam.id}`}>{game.homeTeam.name}</Link>
              </td>
              <td>{game.homeTeamScore}</td>
              <td>{game.awayTeamScore}</td>
              <td>
                <Link to={`/teams/${game.awayTeam.id}`}>{game.awayTeam.name}</Link>
              </td>
              <td>{new Date(game.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="flex items-center gap-2">
                  <Link to={`/games/${game.id}`}>Edit</Link>

                  <Form method="delete">
                    <input type="hidden" name="gameId" value={game.id} />
                    <button>Delete</button>
                  </Form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
