import { ClientActionFunctionArgs, Form, Link, useLoaderData } from '@remix-run/react'
import { teamsTable } from 'src/indexeddb'
import { playersTable } from '~/utils/indexeddb'

export const clientLoader = async () => {
  const teams: any[] = []

  await teamsTable.iterate((value: Record<string, any>, key) => {
    teams.push({ id: key, ...value })
  })

  const players: any[] = []

  await playersTable.iterate((value: Record<string, any>, key) => {
    players.push({ id: key, team: teams.find((t) => t.id === value.teamId), ...value })
  })

  return { teams, players }
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  if (!confirm('Are you sure you want to delete this player?')) return null

  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  await playersTable.removeItem(data.playerId.toString())

  return null
}

export default function Page() {
  const { players } = useLoaderData<typeof clientLoader>()
  return (
    <div>
      <h1>Players</h1>
      <ul>
        <li>
          <Link to={'/players/new'}>New Player</Link>
        </li>
      </ul>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>
                <Link to={`/players/${player.id}`}>{player.name}</Link>
              </td>
              <td>
                {player.team ? (
                  <Link to={`/teams/${player.team.id}`}>{player.team.name}</Link>
                ) : (
                  '-'
                )}
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <Link to={`/players/${player.id}/edit`}>Edit</Link>
                  <Form method="delete">
                    <input type="hidden" name="playerId" value={player.id} />
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
