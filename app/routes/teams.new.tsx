import { ClientActionFunctionArgs, Form, redirect } from '@remix-run/react'
import { teamsTable } from 'src/indexeddb'
import { team_uuid } from '~/utils/uuid'

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const name = data.name.toString().trim()

  await teamsTable.setItem(team_uuid(), { name, createdAt: new Date(), updatedAt: new Date() })

  throw redirect('/teams')
}

export default function Page() {
  return (
    <div>
      <h1>Teams</h1>
      <h2>New team</h2>
      <Form method="post">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" />
        <button>save</button>
      </Form>
    </div>
  )
}

