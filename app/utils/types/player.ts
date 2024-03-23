export type Player = {
  id: string
  name: string
  number: string
  teamId: string
  createdAt: Date
}

export type IndexedDBPlayer = Omit<Player, 'id'>
export type NewPlayer = Omit<Player, 'id' | 'createdAt'>
