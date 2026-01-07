/**
 * Songs 데이터 처리 유틸리티 함수들
 */

/**
 * songs.json 데이터에서 weeklySongs를 생성합니다
 * @param {Array} songs - songs.json의 songs 배열
 * @returns {Array} weeklySongs 배열 (미정 제외, weekLabel 추가)
 */
export function createWeeklySongs(songs) {
  // "미정"이 아닌 곡들만 필터링
  const songsWithData = songs.filter(song => song.date !== '미정')
  
  // weekLabel 추가
  return songsWithData.map((song, index) => ({
    ...song,
    weekLabel: index === 0 ? '이번 주 찬양곡' : `다음 주 찬양곡`
  }))
}

/**
 * 곡이 YouTube 연습 비디오를 가지고 있는지 확인
 * @param {Object} song - 곡 객체
 * @returns {boolean}
 */
export function hasPracticeVideos(song) {
  return !!(song.practiceVideos && Object.keys(song.practiceVideos).length > 0)
}

/**
 * 곡이 로컬 연습 파일을 가지고 있는지 확인
 * @param {Object} song - 곡 객체
 * @returns {boolean}
 */
export function hasPracticeFiles(song) {
  return !!(song.practiceFiles && Object.keys(song.practiceFiles).length > 0)
}

/**
 * 곡이 악보를 가지고 있는지 확인
 * @param {Object} song - 곡 객체
 * @returns {boolean}
 */
export function hasScore(song) {
  return !!(song.hasScore && song.scoreUrl)
}

/**
 * 곡의 연습 자료 타입을 반환 (mutually exclusive)
 * @param {Object} song - 곡 객체
 * @returns {'videos'|'files'|'none'}
 */
export function getPracticeType(song) {
  if (hasPracticeVideos(song)) return 'videos'
  if (hasPracticeFiles(song)) return 'files'
  return 'none'
}

/**
 * 악보 URL이 Firebase URL인지 확인
 * @param {string} scoreUrl - 악보 URL
 * @returns {boolean}
 */
export function isFirebaseUrl(scoreUrl) {
  return !!(scoreUrl && scoreUrl.startsWith('http'))
}

/**
 * 곡 데이터의 유효성을 검증
 * @param {Object} song - 곡 객체
 * @returns {boolean}
 */
export function isValidSong(song) {
  return !!(song && 
         typeof song.id === 'number' && 
         typeof song.title === 'string' && 
         typeof song.date === 'string')
}

/**
 * 악보 다운로드 처리
 * @param {Object} song - 곡 객체
 */
export function downloadScore(song) {
  if (hasScore(song)) {
    if (isFirebaseUrl(song.scoreUrl)) {
      window.open(song.scoreUrl, '_blank')
    } else {
      const link = document.createElement('a')
      link.href = song.scoreUrl
      link.download = `${song.title}.pdf`
      link.click()
    }
    alert(`📄 "${song.title}" 악보를 다운로드합니다.`)
  } else {
    alert(`📄 "${song.title}" 악보가 준비되지 않았습니다.`)
  }
}

/**
 * 연습 파일 공유/다운로드 처리
 * @param {Object} file - 연습 파일 객체
 * @param {string} part - 파트명
 */
export async function sharePracticeFile(file, part) {
  try {
    if (navigator.share && file.audioUrl) {
      await navigator.share({
        title: `${part} 파트 연습 파일`,
        text: `${part} 파트 연습용 오디오 파일입니다.`,
        url: file.audioUrl
      })
    } else {
      const link = document.createElement('a')
      link.href = file.audioUrl
      link.download = `${part}.${file.fileType}`
      link.click()
      alert(`🎵 "${part}" 파트 연습 파일을 다운로드합니다.`)
    }
  } catch (error) {
    console.error('Share failed:', error)
    const link = document.createElement('a')
    link.href = file.audioUrl
    link.download = `${part}.${file.fileType}`
    link.click()
    alert(`🎵 "${part}" 파트 연습 파일을 다운로드합니다.`)
  }
}
