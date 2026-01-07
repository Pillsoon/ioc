/**
 * Songs 데이터 처리 유틸리티 함수들
 * 새 데이터 구조 (2024-01 업데이트)
 */

// 파트명 한글 변환
export const VOICE_PART_LABELS = {
  soprano: '소프라노',
  alto: '앨토',
  tenor: '테너',
  bass: '베이스',
  '합창': '합창'
}

/**
 * ISO 날짜를 사용자 친화적 형식으로 변환
 * @param {string|null} dateStr - ISO 날짜 문자열 (예: "2024-09-22")
 * @returns {string} 변환된 날짜 (예: "9/22")
 */
export function formatDate(dateStr) {
  if (!dateStr) return '미정'
  // ISO 날짜 문자열에서 직접 파싱 (타임존 이슈 방지)
  const [year, month, day] = dateStr.split('-').map(Number)
  return `${month}/${day}`
}

/**
 * songs.json 데이터에서 weeklySongs를 생성합니다
 * @param {Array} songs - songs.json의 songs 배열
 * @returns {Array} weeklySongs 배열 (미정 제외, weekLabel 추가)
 */
export function createWeeklySongs(songs) {
  // 날짜가 있는 곡들만 필터링하고 날짜순 정렬
  const songsWithDate = songs
    .filter(song => song.date !== null)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  // weekLabel 추가
  return songsWithDate.map((song, index) => ({
    ...song,
    displayDate: formatDate(song.date),
    weekLabel: index === 0 ? '이번 주 찬양곡' : '다음 주 찬양곡'
  }))
}

/**
 * 곡이 악보를 가지고 있는지 확인
 * @param {Object} song - 곡 객체
 * @returns {boolean}
 */
export function hasScore(song) {
  return !!(song.score && song.score.url)
}

/**
 * 곡이 연습 자료를 가지고 있는지 확인
 * @param {Object} song - 곡 객체
 * @returns {boolean}
 */
export function hasPractice(song) {
  return !!(song.practice && Object.keys(song.practice).length > 0)
}

/**
 * 연습 자료에서 YouTube 영상만 필터링
 * @param {Object} practice - 연습 자료 객체
 * @returns {Object} YouTube 영상만 포함된 객체
 */
export function getYoutubeVideos(practice) {
  if (!practice) return {}
  return Object.fromEntries(
    Object.entries(practice).filter(([_, item]) => item.type === 'youtube')
  )
}

/**
 * 연습 자료에서 오디오 파일만 필터링
 * @param {Object} practice - 연습 자료 객체
 * @returns {Object} 오디오 파일만 포함된 객체
 */
export function getAudioFiles(practice) {
  if (!practice) return {}
  return Object.fromEntries(
    Object.entries(practice).filter(([_, item]) => item.type === 'mp3' || item.type === 'audio')
  )
}

/**
 * 곡의 연습 자료 타입을 반환
 * @param {Object} song - 곡 객체
 * @returns {'youtube'|'audio'|'mixed'|'none'}
 */
export function getPracticeType(song) {
  if (!hasPractice(song)) return 'none'

  const videos = getYoutubeVideos(song.practice)
  const files = getAudioFiles(song.practice)

  const hasVideos = Object.keys(videos).length > 0
  const hasFiles = Object.keys(files).length > 0

  if (hasVideos && hasFiles) return 'mixed'
  if (hasVideos) return 'youtube'
  if (hasFiles) return 'audio'
  return 'none'
}

/**
 * 악보 URL이 외부 URL인지 확인
 * @param {string} url - URL
 * @returns {boolean}
 */
export function isExternalUrl(url) {
  return !!(url && url.startsWith('http'))
}

/**
 * 곡 데이터의 유효성을 검증
 * @param {Object} song - 곡 객체
 * @returns {boolean}
 */
export function isValidSong(song) {
  return !!(song &&
         typeof song.id === 'string' &&
         typeof song.title === 'string')
}

/**
 * 악보 다운로드 처리
 * @param {Object} song - 곡 객체
 */
export function downloadScore(song) {
  if (hasScore(song)) {
    if (isExternalUrl(song.score.url)) {
      window.open(song.score.url, '_blank')
    } else {
      const link = document.createElement('a')
      link.href = song.score.url
      link.download = `${song.title}.pdf`
      link.click()
    }
    alert(`"${song.title}" 악보를 다운로드합니다.`)
  } else {
    alert(`"${song.title}" 악보가 준비되지 않았습니다.`)
  }
}

/**
 * 연습 파일 공유/다운로드 처리
 * @param {Object} item - 연습 자료 객체 { type, url }
 * @param {string} part - 파트명
 */
export async function sharePracticeFile(item, part) {
  const partLabel = VOICE_PART_LABELS[part] || part

  try {
    if (navigator.share && item.url) {
      await navigator.share({
        title: `${partLabel} 파트 연습 파일`,
        text: `${partLabel} 파트 연습용 오디오 파일입니다.`,
        url: item.url
      })
    } else {
      const link = document.createElement('a')
      link.href = item.url
      link.download = `${partLabel}.${item.type}`
      link.click()
      alert(`"${partLabel}" 파트 연습 파일을 다운로드합니다.`)
    }
  } catch (error) {
    console.error('Share failed:', error)
    const link = document.createElement('a')
    link.href = item.url
    link.download = `${partLabel}.${item.type}`
    link.click()
    alert(`"${partLabel}" 파트 연습 파일을 다운로드합니다.`)
  }
}
