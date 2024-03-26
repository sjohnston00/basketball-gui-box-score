import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  redirect,
  useLoaderData,
} from '@remix-run/react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { PopulatedGame, GameShot, GameFreeThrow, GameStat, GameRebound } from '~/utils/types/game'
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
    x: 0,
    y: 0,
    isThreePointer: false,
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
          <BoxScoreTable
            players={game.homeTeam.players}
            freeThrows={game.freeThrows.filter((ft) => ft.playerTeamId === game.homeTeamId)}
            steals={game.steals.filter((st) => st.playerTeamId === game.homeTeamId)}
            shots={game.shots.filter((s) => s.playerTeamId === game.homeTeamId)}
            blocks={game.blocks.filter((b) => b.playerTeamId === game.homeTeamId)}
            fouls={game.fouls.filter((f) => f.playerTeamId === game.homeTeamId)}
            turnovers={game.turnovers.filter((to) => to.playerTeamId === game.homeTeamId)}
            rebounds={game.rebounds.filter((r) => r.playerTeamId === game.homeTeamId)}
          />
          <div className="flex justify-between items-center mt-4">
            <span>{awayTeamName}</span>
          </div>
          <BoxScoreTable
            players={game.awayTeam.players}
            freeThrows={game.freeThrows.filter((ft) => ft.playerTeamId === game.homeTeamId)}
            steals={game.steals.filter((st) => st.playerTeamId === game.awayTeamId)}
            shots={game.shots.filter((s) => s.playerTeamId === game.awayTeamId)}
            blocks={game.blocks.filter((b) => b.playerTeamId === game.awayTeamId)}
            fouls={game.fouls.filter((f) => f.playerTeamId === game.awayTeamId)}
            turnovers={game.turnovers.filter((to) => to.playerTeamId === game.awayTeamId)}
            rebounds={game.rebounds.filter((r) => r.playerTeamId === game.awayTeamId)}
          />
        </div>
      </div>
    </div>
  )
}

type BoxScoreTableProps = {
  players: Player[]
  shots: GameShot[]
  rebounds: GameRebound[]
  freeThrows: GameFreeThrow[]
  steals: GameStat[]
  blocks: GameStat[]
  turnovers: GameStat[]
  fouls: GameStat[]
}
function BoxScoreTable({
  players,
  shots,
  freeThrows,
  steals,
  blocks,
  turnovers,
  fouls,
  rebounds,
}: BoxScoreTableProps) {
  const madeShots = shots.filter((s) => s.made)
  const madeFreeThrows = freeThrows.filter((ft) => ft.made)

  //TODO: add the total made free throws to the total points as well
  const totalPoints =
    madeShots.reduce((acc, curr) => (curr.isThreePointer ? acc + 3 : acc + 2), 0) +
    madeFreeThrows.length
  const totalAssists = madeShots.filter((s) => s.assistPlayerId).length
  const totalTwoPointersMade = madeShots.filter((s) => !s.isThreePointer).length
  const totalTwoPointersAttempted = shots.filter((s) => !s.isThreePointer).length
  const totalTwoPointerPercentage = percentage(
    totalTwoPointersMade,
    totalTwoPointersAttempted
  ).toFixed(0)

  const totalThreePointersMade = madeShots.filter((s) => s.isThreePointer).length
  const totalThreePointersAttempted = shots.filter((s) => s.isThreePointer).length
  const totalThreePointerPercentage = percentage(
    totalThreePointersMade,
    totalThreePointersAttempted
  ).toFixed(0)

  const totalFreeThrowsMade = freeThrows.filter((s) => s.made).length
  const totalFreeThrowsAttempted = freeThrows.length
  const totalFreeThrowsPercentage = percentage(
    totalFreeThrowsMade,
    totalFreeThrowsAttempted
  ).toFixed(0)

  const totalRebounds = rebounds.length
  const totalSteals = steals.length
  const totalBlocks = blocks.length
  const totalTurnovers = turnovers.length
  const totalFouls = fouls.length
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
          const playerShots = shots.filter((shot) => shot.playerId === player.id)
          const playerFreeThrows = freeThrows.filter((ft) => ft.playerId === player.id)

          const playersTwoPointersAttempted = playerShots.filter((shot) => !shot.isThreePointer)
          const playersTwoPointersMade = playersTwoPointersAttempted.filter((shot) => shot.made)
          const playersTwoPointersPercentage = percentage(
            playersTwoPointersMade.length,
            playersTwoPointersAttempted.length
          ).toFixed(0)

          const playersThreePointersAttempted = playerShots.filter((shot) => shot.isThreePointer)
          const playersThreePointersMade = playersThreePointersAttempted.filter((shot) => shot.made)
          const playersThreePointersPercentage = percentage(
            playersThreePointersMade.length,
            playersThreePointersAttempted.length
          ).toFixed(0)

          const playersFreeThrowsAttempted = playerFreeThrows
          const playersFreeThrowsMade = playersFreeThrowsAttempted.filter((shot) => shot.made)
          const playersFreeThrowsPercentage = percentage(
            playersFreeThrowsMade.length,
            playersFreeThrowsAttempted.length
          ).toFixed(0)

          const playersPoints =
            playersTwoPointersMade.length * 2 +
            playersThreePointersMade.length * 3 +
            playersFreeThrowsMade.length
          const playersAssists = shots.filter((shot) => shot.assistPlayerId === player.id)
          const playersRebounds = rebounds.filter((r) => r.playerId === player.id).length

          const playersSteals = steals.filter((s) => s.playerId === player.id).length
          const playersBlocks = blocks.filter((b) => b.playerId === player.id).length

          const playersTurnovers = turnovers.filter((t) => t.playerId === player.id).length

          const playersFouls = fouls.filter((f) => f.playerId === player.id).length

          return (
            <tr key={player.id}>
              <td>{player.number}</td>
              <td className="!text-left">{player.name}</td>
              <td>{playersPoints}</td>
              <td>{playersAssists.length}</td>
              <td>{playersRebounds}</td>
              <td>{playersTwoPointersMade.length}</td>
              <td>{playersTwoPointersAttempted.length}</td>
              <td>{playersTwoPointersPercentage}%</td>
              <td>{playersThreePointersMade.length}</td>
              <td>{playersThreePointersAttempted.length}</td>
              <td>{playersThreePointersPercentage}%</td>
              <td>{playersFreeThrowsMade.length}</td>
              <td>{playersFreeThrowsAttempted.length}</td>
              <td>{playersFreeThrowsPercentage}%</td>
              <td>{playersSteals}</td>
              <td>{playersBlocks}</td>
              <td>{playersTurnovers}</td>
              <td>{playersFouls}</td>
            </tr>
          )
        })}
      </tbody>
      <tfoot>
        <tr>
          <th>Total</th>
          <th></th>
          <th>{totalPoints}</th>
          <th>{totalAssists}</th>
          <th>{totalRebounds}</th>
          <th>{totalTwoPointersMade}</th>
          <th>{totalTwoPointersAttempted}</th>
          <th>{totalTwoPointerPercentage}%</th>
          <th>{totalThreePointersMade}</th>
          <th>{totalThreePointersAttempted}</th>
          <th>{totalThreePointerPercentage}%</th>
          <th>{totalFreeThrowsMade}</th>
          <th>{totalFreeThrowsAttempted}</th>
          <th>{totalFreeThrowsPercentage}%</th>
          <th>{totalSteals}</th>
          <th>{totalBlocks}</th>
          <th>{totalTurnovers}</th>
          <th>{totalFouls}</th>
        </tr>
      </tfoot>
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
            <optgroup label={game.homeTeam.name}>
              {game.homeTeam.players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </optgroup>
            <optgroup label={game.awayTeam.name}>
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
