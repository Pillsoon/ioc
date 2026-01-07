/**
 * Date utility functions for the choir app
 */

/**
 * Parse a date string in MM/DD format and return a Date object
 * @param {string} dateStr - Date string in MM/DD format
 * @returns {Date} - Date object for the current year
 */
export function parseDate(dateStr) {
  if (dateStr === '미정') {
    return new Date('2099-12-31') // Far future date for sorting
  }
  
  const [month, day] = dateStr.split('/').map(Number)
  const currentYear = new Date().getFullYear()
  return new Date(currentYear, month - 1, day)
}

/**
 * Get the next Sunday date from a given date
 * @param {Date} date - Starting date
 * @returns {Date} - Next Sunday date
 */
export function getNextSunday(date) {
  const dayOfWeek = date.getDay()
  const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek
  const nextSunday = new Date(date)
  nextSunday.setDate(date.getDate() + daysUntilSunday)
  return nextSunday
}

/**
 * Get today's date
 * @returns {Date} - Today's date
 */
export function getToday() {
  return new Date()
}

/**
 * Format a date to MM/DD string
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}/${day}`
}

/**
 * Check if a date is in the future
 * @param {Date} date - Date to check
 * @returns {boolean} - True if date is in the future
 */
export function isFutureDate(date) {
  const today = getToday()
  today.setHours(0, 0, 0, 0) // Reset time to start of day
  return date >= today
}

/**
 * Sort songs by date, with future dates first, then "미정" songs
 * @param {Array} songs - Array of song objects
 * @returns {Array} - Sorted array of songs
 */
export function sortSongsByDate(songs) {
  return songs.sort((a, b) => {
    const dateA = parseDate(a.date)
    const dateB = parseDate(b.date)
    
    // If both are "미정", maintain original order
    if (a.date === '미정' && b.date === '미정') {
      return 0
    }
    
    // If one is "미정", put it at the end
    if (a.date === '미정') return 1
    if (b.date === '미정') return -1
    
    // Sort by date
    return dateA - dateB
  })
}

/**
 * Get upcoming songs (up to a limit)
 * @param {Array} songs - Array of song objects
 * @param {number} limit - Maximum number of songs to return
 * @returns {Array} - Array of upcoming songs
 */
export function getUpcomingSongs(songs, limit = 5) {
  const sortedSongs = sortSongsByDate(songs)
  const upcomingSongs = []
  
  for (const song of sortedSongs) {
    if (upcomingSongs.length >= limit) break
    
    const songDate = parseDate(song.date)
    
    // Include future dates and "미정" songs
    if (isFutureDate(songDate) || song.date === '미정') {
      upcomingSongs.push(song)
    }
  }
  
  return upcomingSongs
}

/**
 * Get the next 5 Sunday dates from today
 * @returns {Array} - Array of next 5 Sunday dates
 */
export function getNext5Sundays() {
  const today = getToday()
  const nextSunday = getNextSunday(today)
  const sundays = []
  
  for (let i = 0; i < 5; i++) {
    const sunday = new Date(nextSunday)
    sunday.setDate(nextSunday.getDate() + (i * 7))
    sundays.push(formatDate(sunday))
  }
  
  return sundays
}




