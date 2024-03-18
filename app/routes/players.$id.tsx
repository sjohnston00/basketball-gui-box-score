import { useParams } from '@remix-run/react'

export default function Page() {
  const { id } = useParams()

  return (
    <div>
      <h1>Players</h1>
      <span>Player ID: {id}</span>
    </div>
  )
}
