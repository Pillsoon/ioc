/**
 * 날짜 관련 유틸리티 함수
 */

/**
 * 향후 N주간의 주일(일요일) 날짜 배열을 반환
 * @param {number} weeks - 표시할 주 수 (기본값: 6)
 * @returns {string[]} ISO 날짜 문자열 배열 (예: ["2026-01-11", "2026-01-18", ...])
 */
export function getUpcomingSundays(weeks = 6) {
  const sundays = []
  const today = new Date()

  // 오늘 또는 다음 일요일 찾기
  const dayOfWeek = today.getDay() // 0 = 일요일
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek

  const nextSunday = new Date(today)
  nextSunday.setDate(today.getDate() + daysUntilSunday)
  nextSunday.setHours(0, 0, 0, 0)

  // N주간의 일요일 추가
  for (let i = 0; i < weeks; i++) {
    const sunday = new Date(nextSunday)
    sunday.setDate(nextSunday.getDate() + (i * 7))
    sundays.push(formatDateISO(sunday))
  }

  return sundays
}

/**
 * Date 객체를 ISO 날짜 문자열로 변환 (YYYY-MM-DD)
 * @param {Date} date
 * @returns {string}
 */
export function formatDateISO(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * ISO 날짜를 한국어 형식으로 변환
 * @param {string} dateStr - ISO 날짜 문자열 (예: "2026-01-11")
 * @returns {string} 한국어 형식 (예: "1/11 (일)")
 */
export function formatDateKorean(dateStr) {
  if (!dateStr) return ''

  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  const dayName = dayNames[date.getDay()]

  return `${month}/${day} (${dayName})`
}

/**
 * 날짜가 오늘 이전인지 확인
 * @param {string} dateStr - ISO 날짜 문자열
 * @returns {boolean}
 */
export function isPastDate(dateStr) {
  if (!dateStr) return false

  const [year, month, day] = dateStr.split('-').map(Number)
  const targetDate = new Date(year, month - 1, day)
  targetDate.setHours(23, 59, 59, 999) // 하루 끝까지 허용

  const today = new Date()
  return targetDate < today
}

/**
 * 오늘 날짜를 ISO 형식으로 반환
 * @returns {string}
 */
export function getTodayISO() {
  return formatDateISO(new Date())
}
