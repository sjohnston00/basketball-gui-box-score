import { ClientActionFunctionArgs, Form, redirect } from '@remix-run/react'
import { createTeam } from '~/utils/teams'

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const name = data.name.toString().trim()
  const abbreviation = data.abbreviation.toString().trim()

  await createTeam({ name, abbreviation })

  throw redirect('/teams')
}

export default function Page() {
  return (
    <div>
      <h1>Teams</h1>
      <h2>New team</h2>
      <Form method="post">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" required />
        <label htmlFor="abbreviation">Abbreviation</label>
        <input type="text" name="abbreviation" id="abbreviation" required />
        <button>save</button>
      </Form>
    </div>
  )
}
