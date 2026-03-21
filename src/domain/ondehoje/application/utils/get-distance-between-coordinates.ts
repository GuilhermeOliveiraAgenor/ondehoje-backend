export interface Coordinate {
  latitude: number
  longitude: number
}

const EARTH_RADIUS_KM = 6371

const toRadians = (degrees: number): number => degrees * (Math.PI / 180)

export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
) {
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0
  }

  const dLat = toRadians(to.latitude - from.latitude)
  const dLon = toRadians(to.longitude - from.longitude)

  const lat1Rad = toRadians(from.latitude)
  const lat2Rad = toRadians(to.latitude)

  // Parte 'a' da fórmula de Haversine
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1Rad) *
      Math.cos(lat2Rad)

  // Parte 'c' (distância angular em radianos)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  // Distância final
  const distance = EARTH_RADIUS_KM * c

  // Retorna com arredondamento para 2 casas decimais (opcional)
  return Math.round(distance * 100) / 100
}
