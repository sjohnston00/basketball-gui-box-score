import { useParams } from '@remix-run/react'

export default function Page() {
  const { id } = useParams()

  return (
    <div>
      <h1>Teams</h1>
      <span>Team ID: {id}</span>
    </div>
  )
}
