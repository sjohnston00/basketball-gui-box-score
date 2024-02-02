import localforage from 'localforage'

export const teamsTable = localforage.createInstance({
  description: 'basketball-tracker-db',
  driver: localforage.INDEXEDDB,
  name: 'basketball-tracker-db',
  storeName: 'teams',
  version: 1,
})

export const playersTable = localforage.createInstance({
  description: 'basketball-tracker-db',
  driver: localforage.INDEXEDDB,
  name: 'basketball-tracker-db',
  storeName: 'players',
  version: 1,
})
