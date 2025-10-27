const PARTICIPATION_KEY = 'nomad_event_participations_user'

// Get all participating event IDs
export function getParticipations(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(PARTICIPATION_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// Check if user is participating in an event
export function isParticipating(eventId: string): boolean {
  const participations = getParticipations()
  return participations.includes(eventId)
}

// Add event to participations
export function addParticipation(eventId: string): void {
  if (typeof window === 'undefined') return

  const participations = getParticipations()
  if (!participations.includes(eventId)) {
    participations.push(eventId)
    try {
      localStorage.setItem(PARTICIPATION_KEY, JSON.stringify(participations))
    } catch {
      console.error('Failed to save participation')
    }
  }
}

// Remove event from participations
export function removeParticipation(eventId: string): void {
  if (typeof window === 'undefined') return

  const participations = getParticipations()
  const filtered = participations.filter((id) => id !== eventId)

  try {
    localStorage.setItem(PARTICIPATION_KEY, JSON.stringify(filtered))
  } catch {
    console.error('Failed to remove participation')
  }
}

// Toggle participation
export function toggleParticipation(eventId: string): boolean {
  if (isParticipating(eventId)) {
    removeParticipation(eventId)
    return false
  } else {
    addParticipation(eventId)
    return true
  }
}
