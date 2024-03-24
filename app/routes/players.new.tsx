import { ClientActionFunctionArgs, Form, redirect, useLoaderData } from '@remix-run/react'
import { createPlayer } from '~/utils/players'
import { getTeams } from '~/utils/teams'

export const clientLoader = async () => {
  const teams = await getTeams()

  return { teams }
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  await createPlayer({
    name: data.name.toString().trim(),
    number: data.number.toString().trim(),
    teamId: data.teamId.toString().trim(),
  })

  throw redirect('/players')
}

export default function Page() {
  const { teams } = useLoaderData<typeof clientLoader>()

  return (
    <div>
      <h1>Players</h1>
      <h2>New Player</h2>
      <Form method="post">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" required />
        <label htmlFor="number">Number</label>
        <input type="number" min={0} name="number" id="number" required />
        <label htmlFor="teamId">Team</label>
        <select name="teamId" id="teamId" defaultValue="">
          <option value="" disabled>
            Select a team
          </option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <br />
        <button>Save</button>
      </Form>
    </div>
  )
}

