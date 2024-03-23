import { ClientActionFunctionArgs, Form, Link, useLoaderData } from '@remix-run/react'
import { teamsTable } from '~/utils/indexeddb'

export const clientLoader = async () => {
  const teams: any[] = []

  await teamsTable.iterate((value: Record<string, any>, key) => {
    teams.push({ id: key, ...value })
  })
  return {
    teams: teams,
  }
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  if (!confirm('Are you sure you want to delete this team?')) return null
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  await teamsTable.removeItem(data.teamId.toString())

  return null
}

export default function Page() {
  const { teams } = useLoaderData<typeof clientLoader>()
  return (
    <div>
      <h1>Teams</h1>
      <ul>
        <li>
          <Link to={'/teams/new'}>New Team</Link>
        </li>
      </ul>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id}>
              <td>
                <Link to={`/teams/${team.id}`}>{team.name}</Link>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <Link to={`/teams/${team.id}/edit`}>Edit</Link>
                  <Form method="delete">
                    <input type="hidden" name="teamId" value={team.id} />
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
