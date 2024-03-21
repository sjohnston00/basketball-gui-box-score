import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  redirect,
  useLoaderData,
} from '@remix-run/react'
import { teamsTable } from '~/utils/indexeddb'

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const teamId = params.id
  if (!teamId) {
    throw redirect('/teams')
  }
  const team = await teamsTable.getItem<{
    name: string
    createdAt: Date
    updatedAt: Date
  }>(teamId)
  if (!team) {
    throw new Response('team not found', {
      status: 404,
    })
  }

  return {
    team,
  }
}

export const clientAction = async ({ request, params }: ClientActionFunctionArgs) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  const teamId = params.id
  if (!teamId) {
    throw redirect('/teams')
  }

  const team = await teamsTable.getItem<{
    name: string
    createdAt: Date
  }>(teamId)
  if (!team) {
    throw new Response('team not found', {
      status: 404,
    })
  }

  await teamsTable.setItem(teamId, {
    ...team,
    name: data.name.toString().trim(),
    updatedAt: new Date(),
  })

  throw redirect('/teams')
}

export default function Page() {
  const { team } = useLoaderData<typeof clientLoader>()

  return (
    <div>
      <h1>Teams</h1>
      <h2>Edit Team</h2>
      <Form method="post">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" defaultValue={team.name} required />
        <button>save</button>
      </Form>
    </div>
  )
}

