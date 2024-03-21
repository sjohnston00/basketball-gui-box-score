import {
  ClientLoaderFunctionArgs,
  Link,
  redirect,
  useLoaderData,
  useParams,
} from '@remix-run/react'
import React from 'react'
import { gamesTable, teamsTable } from '~/utils/indexeddb'

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const gameId = params.id
  if (!gameId) {
    throw redirect('/games')
  }

  const game = await gamesTable.getItem(gameId)
  if (!game) {
    throw new Response('Game not found', { status: 404 })
  }

  const teams: any[] = []

  await teamsTable.iterate((value: Record<string, any>, key) => {
    teams.push({ id: key, ...value })
  })

  return {
    game: {
      ...game,
      homeTeam: { ...teams.find((team) => team.id === game.homeTeamId), players: [] },
      awayTeam: { ...teams.find((team) => team.id === game.awayTeamId), players: [] },
      homeTeamScore: 0,
      awayTeamScore: 0,
    },
    teams: teams,
  }
}

export default function Page() {
  const { game } = useLoaderData<typeof clientLoader>()
  const homeTeamName = game.homeTeam.name
  const awayTeamName = game.awayTeam.name
  const homeTeamScore = game.homeTeamScore
  const awayTeamScore = game.awayTeamScore
  return (
    <div>
      <h1>Games</h1>
      <div className="flex justify-evenly mb-8">
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold">{homeTeamName}</span>
          <span>{homeTeamScore}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold">{awayTeamName}</span>
          <span>{awayTeamScore}</span>
        </div>
      </div>
      <div className="flex gap-4">
        <canvas
          height={450}
          width={400}
          style={{
            backgroundColor: 'black',
          }}
        ></canvas>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span>{homeTeamName}</span>
          </div>
          <BoxScoreTable>
            {game.homeTeam.players.map((player) => (
              <tr key={player.id}>
                <td>{player.number}</td>
                <td>{player.name}</td>
                <td>{player.points}</td>
                <td>{player.assists}</td>
                <td>{player.rebounds}</td>
                <td>{player.twoPointsMade}</td>
                <td>{player.twoPointsAttempted}</td>
                <td>{player.twoPointsPercentage}</td>
                <td>{player.threePointsMade}</td>
                <td>{player.threePointsAttempted}</td>
                <td>{player.threePointsPercentage}</td>
                <td>{player.freeThrowsMade}</td>
                <td>{player.freeThrowsAttempted}</td>
                <td>{player.freeThrowsPercentage}</td>
                <td>{player.steals}</td>
                <td>{player.blocks}</td>
                <td>{player.turnovers}</td>
                <td>{player.personalFouls}</td>
              </tr>
            ))}
          </BoxScoreTable>
          <div className="flex justify-between items-center mt-4">
            <span>{awayTeamName}</span>
          </div>
          <BoxScoreTable>
            {game.homeTeam.players.map((player) => (
              <tr key={player.id}>
                <td>{player.number}</td>
                <td>{player.name}</td>
                <td>{player.points}</td>
                <td>{player.assists}</td>
                <td>{player.rebounds}</td>
                <td>{player.twoPointsMade}</td>
                <td>{player.twoPointsAttempted}</td>
                <td>{player.twoPointsPercentage}</td>
                <td>{player.threePointsMade}</td>
                <td>{player.threePointsAttempted}</td>
                <td>{player.threePointsPercentage}</td>
                <td>{player.freeThrowsMade}</td>
                <td>{player.freeThrowsAttempted}</td>
                <td>{player.freeThrowsPercentage}</td>
                <td>{player.steals}</td>
                <td>{player.blocks}</td>
                <td>{player.turnovers}</td>
                <td>{player.personalFouls}</td>
              </tr>
            ))}
          </BoxScoreTable>
        </div>
      </div>
    </div>
  )
}

type BoxScoreTableProps = {
  children?: React.ReactNode
}
function BoxScoreTable({ children }: BoxScoreTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>PTS</th>
          <th>AST</th>
          <th>REB</th>
          <th>2PM</th>
          <th>2PA</th>
          <th>2P%</th>
          <th>3PM</th>
          <th>3PA</th>
          <th>3P%</th>
          <th>FTM</th>
          <th>FTA</th>
          <th>FT%</th>
          <th>STL</th>
          <th>BLK</th>
          <th>TO</th>
          <th>FLS</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}

