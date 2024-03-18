export function uuid() {
  return window.crypto.randomUUID().replaceAll('-', '')
}

export function team_uuid() {
  return `team${uuid()}`
}
export function player_uuid() {
  return `player${uuid()}`
}
export function pame_uuid() {
  return `game${uuid()}`
}
