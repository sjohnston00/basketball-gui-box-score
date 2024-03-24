import { ClientActionFunctionArgs, Form, Link, useLoaderData } from '@remix-run/react'
import { deletePlayer, getPlayers } from '~/utils/players'
import { getTeams } from '~/utils/teams'

export const clientLoader = async () => {
  const teams = await getTeams()

  const players = await getPlayers()
  for (let index = 0; index < players.length; index++) {
    players[index] = {
      ...players[index],
      team: teams.find((team) => team.id === players[index].teamId),
    }
  }

  return { teams, players }
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  if (!confirm('Are you sure you want to delete this player?')) return null

  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const playerId = data.playerId.toString().trim()

  await deletePlayer(playerId)

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

