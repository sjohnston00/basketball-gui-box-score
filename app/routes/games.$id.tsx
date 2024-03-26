import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  redirect,
  useLoaderData,
} from '@remix-run/react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { PopulatedGame, GameShot } from '~/utils/types/game'
import { getGameById } from '~/utils/games'
import { gamesTable } from '~/utils/indexeddb'
import { Player } from '~/utils/types/player'
import { percentage } from '~/utils/math'

let currentGame: PopulatedGame | undefined

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const gameId = params.id
  if (!gameId) {
    throw redirect('/games')
  }

  const game = await getGameById(gameId)
  if (!game) {
    throw new Response('Game not found', { status: 404 })
  }

  const allGamePlayers = [...game.homeTeam.players, ...game.awayTeam.players]

  //TODO: filter the assist players select box by players on their team
  //TODO: add isThreePointer boolean to shot object and calculate score based on that
  //TODO: add freeThrow shots array to game object and calculate score based on that
  //TODO: add total footer rows for each team box score table and calculate totals
  //TODO: calculate percentages based for shot types
  //TODO: add column for total FGM, FGA and FG%

  currentGame = game
  return {
    game,
    allGamePlayers,
  }
}

export const clientAction = async ({ params, request }: ClientActionFunctionArgs) => {
  const gameId = params.id
  if (!gameId) {
    throw redirect('/games')
  }

  const game = await getGameById(gameId)
  if (!game) {
    throw new Response('Game not found', { status: 404 })
  }

  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const shotPlayerId = data.shotPlayerId
  const assistPlayerId = data.assistPlayerId
  console.log(data)

  const shotMade = data.shotMade === 'true'

  const playerTeamId = currentGame?.homeTeam.players.find(
    (player: Player) => player.id === shotPlayerId
  )
    ? currentGame.homeTeamId
    : currentGame?.awayTeam.players.find((player: Player) => player.id === shotPlayerId)
      ? currentGame.awayTeamId
      : undefined

  if (!playerTeamId) {
    alert('Player not found')
    return null
  }

  currentGame?.shots.push({
    playerId: shotPlayerId.toString(),
    playerTeamId,
    made: shotMade,
    assistPlayerId: shotMade && assistPlayerId ? assistPlayerId.toString() : undefined,
    createdAt: new Date(),
  })

  await gamesTable.setItem(gameId, {
    ...game,
    shots: currentGame?.shots,
    updatedAt: new Date(),
  })

  return {
    data,
  }
}

export default function Page() {
  const { game, allGamePlayers } = useLoaderData<typeof clientLoader>()
  const dialogRef = useRef<HTMLDialogElement>(null)

  const homeTeamName = game.homeTeam.name
  const awayTeamName = game.awayTeam.name
  const homeTeamScore = game.homeTeamScore
  const awayTeamScore = game.awayTeamScore

  useEffect(() => {
    dialogRef.current?.addEventListener('click', () => dialogRef.current?.close())

    return () => {
      dialogRef.current?.removeEventListener('click', () => dialogRef.current?.close())
    }
  }, [])

  return (
    <div>
      <AddShotDialog game={game} allGamePlayers={allGamePlayers} ref={dialogRef} />
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
          onClick={() => {
            dialogRef.current?.showModal()
          }}
          style={{
            backgroundColor: 'black',
          }}
        ></canvas>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span>{homeTeamName}</span>
          </div>
          <BoxScoreTable players={game.homeTeam.players} shots={game.shots} />
          <div className="flex justify-between items-center mt-4">
            <span>{awayTeamName}</span>
          </div>
          <BoxScoreTable players={game.awayTeam.players} shots={game.shots} />
        </div>
      </div>
    </div>
  )
}

type BoxScoreTableProps = {
  players: Player[]
  shots: GameShot[]
}
function BoxScoreTable({ players, shots }: BoxScoreTableProps) {
  return (
    <table className="w-full box-score-table">
      <thead>
        <tr>
          <th>#</th>
          <th className="!text-left">Name</th>
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
      <tbody>
        {players.map((player) => {
          const playersTwoPointShots = shots.filter((shot) => shot.playerId === player.id)
          const playersTwoPointsMade = playersTwoPointShots.filter((shot) => shot.made)
          const playersTwoPointPercentage = percentage(
            playersTwoPointsMade.length,
            playersTwoPointShots.length
          ).toFixed(0)

          const playersPoints = playersTwoPointsMade.length * 2

          const playersAssists = shots.filter((shot) => shot.assistPlayerId === player.id)

          return (
            <tr key={player.id}>
              <td>{player.number}</td>
              <td className="!text-left">{player.name}</td>
              <td>{playersPoints}</td>
              <td>{playersAssists.length}</td>
              <td>{player.rebounds || 0}</td>
              <td>{playersTwoPointsMade.length}</td>
              <td>{playersTwoPointShots.length}</td>
              <td>{playersTwoPointPercentage}%</td>
              <td>{player.threePointsMade || 0}</td>
              <td>{player.threePointsAttempted || 0}</td>
              <td>{player.threePointsPercentage || 0}%</td>
              <td>{player.freeThrowsMade || 0}</td>
              <td>{player.freeThrowsAttempted || 0}</td>
              <td>{player.freeThrowsPercentage || 0}%</td>
              <td>{player.steals || 0}</td>
              <td>{player.blocks || 0}</td>
              <td>{player.turnovers || 0}</td>
              <td>{player.personalFouls || 0}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

type AddShotDialogProps = {
  game: PopulatedGame
  allGamePlayers: Player[]
}
const AddShotDialog = forwardRef<HTMLDialogElement, AddShotDialogProps>(function AddShotDialog(
  { game, allGamePlayers },
  dialogRef
) {
  const dialogDivRef = useRef<HTMLDivElement>(null)
  const addShotFormRef = useRef<HTMLFormElement>(null)
  const [selectedPlayerShot, setSelectedPlayerShot] = useState<Player | undefined>(undefined)

  useEffect(() => {
    dialogDivRef.current?.addEventListener('click', (e) => e.stopPropagation())

    return () => {
      dialogDivRef.current?.removeEventListener('click', (e) => e.stopPropagation())
    }
  }, [])
  return (
    <dialog ref={dialogRef}>
      <div ref={dialogDivRef} className="p-4">
        <div className="flex justify-between items-center">
          <h1>Add shot</h1>
          <form
            method="dialog"
            onSubmit={() => {
              addShotFormRef.current?.reset()
            }}
          >
            <button>x</button>
          </form>
        </div>
        <Form
          ref={addShotFormRef}
          method="post"
          className="w-full"
          onSubmit={() => {
            dialogRef?.current?.close()
          }}
        >
          <div className="my-4 flex justify-around items-center gap-2">
            <label>
              <input type="radio" name="shotMade" id="shotMadeTrue" value="true" required />
              make
            </label>
            <label>
              <input type="radio" name="shotMade" id="shotMadeFalse" value="false" required />
              miss
            </label>
          </div>
          <h2>Player shot</h2>
          <select
            name="shotPlayerId"
            id="shotPlayerId"
            value={selectedPlayerShot?.id}
            onChange={(e) => {
              const player = allGamePlayers.find((player) => player.id === e.target.value)
              setSelectedPlayerShot(player)
            }}
            defaultValue=""
            required
          >
            <option value="" disabled></option>
            <optgroup label="Home Team">
              {game.homeTeam.players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Away Team">
              {game.awayTeam.players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </optgroup>
          </select>

          <h2>Assisted by</h2>
          <select name="assistPlayerId" id="assistPlayerId">
            <option value="">No assist</option>
            {allGamePlayers
              .filter(
                (p) => p.teamId === selectedPlayerShot?.teamId && p.id !== selectedPlayerShot?.id
              )
              .map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
          </select>
          <button className="block w-full mt-4 p-2 rounded">save</button>
        </Form>
      </div>
    </dialog>
  )
})
