import { ClientActionFunctionArgs, Form, Link, redirect, useLoaderData } from '@remix-run/react'
import { createGame } from '~/utils/games'
import { getTeams } from '~/utils/teams'

export const clientLoader = async () => {
  const teams = await getTeams()

  return {
    teams,
  }
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const homeTeamId = data.homeTeam
  const awayTeamId = data.awayTeam

  if (homeTeamId === awayTeamId) {
    alert('Home and Away teams must be different')
    return null
  }

  await createGame({
    homeTeamId: data.homeTeam.toString().trim(),
    awayTeamId: data.awayTeam.toString().trim(),
  })

  throw redirect('/games')
}

export default function Page() {
  const { teams } = useLoaderData<typeof clientLoader>()
  return (
    <div>
      <h1>Games</h1>
      <h2>New Game</h2>
      <ul>
        <li>
          <Link to="/games">back</Link>
        </li>
      </ul>

      <Form method="post">
        <label htmlFor="homeTeam">Home Team</label>
        <select name="homeTeam" id="homeTeam" defaultValue="" required>
          <option value="" disabled>
            Select a team
          </option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <label htmlFor="awayTeam">Away Team</label>
        <select name="awayTeam" id="awayTeam" defaultValue="" required>
          <option value="" disabled>
            Select a team
          </option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <button>Save</button>
      </Form>
    </div>
  )
}
