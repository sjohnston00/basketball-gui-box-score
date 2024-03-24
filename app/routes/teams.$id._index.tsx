import { ClientLoaderFunctionArgs, Link, redirect, useLoaderData } from '@remix-run/react'
import { getTeamById } from '~/utils/teams'

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const teamId = params.id
  if (!teamId) {
    throw redirect('/teams')
  }
  const team = await getTeamById(teamId)
  if (!team) {
    throw new Response('team not found', {
      status: 404,
    })
  }

  return {
    team,
  }
}

export default function Page() {
  const { team } = useLoaderData<typeof clientLoader>()

  return (
    <div>
      <h1>Teams</h1>
      <div className="flex justify-between items-center">
        <h2>{team.name}</h2>
        <Link to={`/teams/${team.id}/edit`}>Edit</Link>
      </div>
      <h3>Players</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {team.players.map((player) => (
            <tr key={player.id}>
              <td>
                <Link to={`/players/${player.id}`}>{player.number}</Link>
              </td>
              <td>{player.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

