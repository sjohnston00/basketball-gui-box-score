export function uuid() {
  return window.crypto.randomUUID().replaceAll('-', '')
}

export function generateTeam_uuid() {
  return `team${uuid()}`
}
export function generatePlayer_uuid() {
  return `player${uuid()}`
}
