import { ClientActionFunctionArgs, Form, Link, useLoaderData } from '@remix-run/react'
import { gamesTable, teamsTable } from '~/utils/indexeddb'

export const clientLoader = async () => {
  const teams: any[] = []

  await teamsTable.iterate((value: Record<string, any>, key) => {
    teams.push({ id: key, ...value })
  })

  const games: any[] = []

  await gamesTable.iterate((value: Record<string, any>, key) => {
    const homeTeamScore = value.homeTeamShots.reduce((acc, curr) => (acc + curr.made ? 2 : 0), 0)
    const awayTeamScore = value.awayTeamShots.reduce((acc, curr) => (acc + curr.made ? 2 : 0), 0)

    games.push({
      id: key,
      homeTeam: teams.find((t) => t.id === value.homeTeamId),
      awayTeam: teams.find((t) => t.id === value.awayTeamId),
      homeTeamScore: homeTeamScore,
      awayTeamScore: awayTeamScore,
      ...value,
    })
  })
  return {
    teams,
    games,
  }
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  if (!confirm('Are you sure you want to delete this game?')) return null
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  await gamesTable.removeItem(data.gameId.toString())

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
              <td>{game.createdAt.toLocaleDateString()}</td>
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
