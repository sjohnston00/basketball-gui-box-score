import { ClientActionFunctionArgs, Form, redirect, useLoaderData } from '@remix-run/react'
import { teamsTable } from 'src/indexeddb'
import { playersTable } from '~/utils/indexeddb'
import { player_uuid } from '~/utils/uuid'

export const clientLoader = async () => {
  const teams: any[] = []

  await teamsTable.iterate((value: Record<string, any>, key) => {
    teams.push({ id: key, ...value })
  })

  return { teams }
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  await playersTable.setItem(player_uuid(), {
    name: data.name,
    number: data.number,
    teamId: data.teamId,
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
