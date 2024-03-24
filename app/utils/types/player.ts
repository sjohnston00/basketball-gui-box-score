export type Player = {
  id: string
  name: string
  number: string
  teamId?: string
  createdAt: Date
  updatedAt: Date
}

export type IndexedDBPlayer = Omit<Player, 'id'>
export type NewPlayer = Omit<IndexedDBPlayer, 'createdAt' | 'updatedAt'>
export type UpdatePlayer = Omit<IndexedDBPlayer, 'updatedAt'>

