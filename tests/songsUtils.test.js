import { describe, it, expect } from 'vitest'
import { 
  createWeeklySongs, 
  hasPracticeVideos, 
  hasPracticeFiles, 
  hasScore, 
  getPracticeType, 
  isFirebaseUrl, 
  isValidSong 
} from '../utils/songsUtils.js'

describe('songsUtils', () => {
  // 테스트용 샘플 데이터
  const sampleSongs = [
    {
      id: 2,
      date: "9/22",
      title: "강하고 담대하라",
      composer: "김영광",
      hasScore: true,
      hasAudio: true,
      scoreUrl: "https://firebase-storage-url.com/scores/song1.pdf",
      isYouTube: true,
      practiceVideos: {
        "합창": "https://youtu.be/qSKgDGN5FBM?si=fmHVYr1OD4XZlt5S",
        "소프라노": "https://youtu.be/Fnvx0EC14v0?si=I5mGnB2nEKlTZJb4"
      }
    },
    {
      id: 1,
      date: "9/29", 
      title: "새 노래로 찬양",
      composer: null,
      hasScore: true,
      hasAudio: true,
      scoreUrl: "/data/새 노래로 찬양/score.pdf",
      practiceFiles: {
        "소프라노": {
          "audioUrl": "/data/새 노래로 찬양/soprano.mp3",
          "fileType": "mp3"
        }
      }
    },
    {
      id: 3,
      date: "미정",
      title: "주님의 은혜",
      composer: null,
      hasScore: false,
      hasAudio: false
    }
  ]

  describe('createWeeklySongs', () => {
    it('should filter out songs with date "미정"', () => {
      const result = createWeeklySongs(sampleSongs)
      expect(result).toHaveLength(2)
      expect(result.every(song => song.date !== '미정')).toBe(true)
    })

    it('should add weekLabel to songs', () => {
      const result = createWeeklySongs(sampleSongs)
      expect(result[0].weekLabel).toBe('이번 주 찬양곡')
      expect(result[1].weekLabel).toBe('다음 주 찬양곡')
    })

    it('should preserve all other song properties', () => {
      const result = createWeeklySongs(sampleSongs)
      expect(result[0].title).toBe('강하고 담대하라')
      expect(result[0].composer).toBe('김영광')
      expect(result[1].title).toBe('새 노래로 찬양')
    })

    it('should handle empty array', () => {
      const result = createWeeklySongs([])
      expect(result).toHaveLength(0)
    })

    it('should handle array with only "미정" songs', () => {
      const onlyUndefinedSongs = [
        { id: 1, date: "미정", title: "Song 1" },
        { id: 2, date: "미정", title: "Song 2" }
      ]
      const result = createWeeklySongs(onlyUndefinedSongs)
      expect(result).toHaveLength(0)
    })
  })

  describe('hasPracticeVideos', () => {
    it('should return true for songs with practiceVideos', () => {
      const songWithVideos = sampleSongs[0]
      expect(hasPracticeVideos(songWithVideos)).toBe(true)
    })

    it('should return false for songs without practiceVideos', () => {
      const songWithoutVideos = sampleSongs[1]
      expect(hasPracticeVideos(songWithoutVideos)).toBe(false)
    })

    it('should return false for songs with empty practiceVideos', () => {
      const songWithEmptyVideos = { practiceVideos: {} }
      expect(hasPracticeVideos(songWithEmptyVideos)).toBe(false)
    })

    it('should return false for songs with null practiceVideos', () => {
      const songWithNullVideos = { practiceVideos: null }
      expect(hasPracticeVideos(songWithNullVideos)).toBe(false)
    })
  })

  describe('hasPracticeFiles', () => {
    it('should return true for songs with practiceFiles', () => {
      const songWithFiles = sampleSongs[1]
      expect(hasPracticeFiles(songWithFiles)).toBe(true)
    })

    it('should return false for songs without practiceFiles', () => {
      const songWithoutFiles = sampleSongs[0]
      expect(hasPracticeFiles(songWithoutFiles)).toBe(false)
    })

    it('should return false for songs with empty practiceFiles', () => {
      const songWithEmptyFiles = { practiceFiles: {} }
      expect(hasPracticeFiles(songWithEmptyFiles)).toBe(false)
    })
  })

  describe('hasScore', () => {
    it('should return true for songs with score', () => {
      const songWithScore = sampleSongs[0]
      expect(hasScore(songWithScore)).toBe(true)
    })

    it('should return false for songs without score', () => {
      const songWithoutScore = sampleSongs[2]
      expect(hasScore(songWithoutScore)).toBe(false)
    })

    it('should return false for songs with hasScore true but no scoreUrl', () => {
      const songWithScoreFlag = { hasScore: true, scoreUrl: null }
      expect(hasScore(songWithScoreFlag)).toBe(false)
    })
  })

  describe('getPracticeType', () => {
    it('should return "videos" for songs with practiceVideos', () => {
      const songWithVideos = sampleSongs[0]
      expect(getPracticeType(songWithVideos)).toBe('videos')
    })

    it('should return "files" for songs with practiceFiles', () => {
      const songWithFiles = sampleSongs[1]
      expect(getPracticeType(songWithFiles)).toBe('files')
    })

    it('should return "none" for songs without practice materials', () => {
      const songWithoutPractice = sampleSongs[2]
      expect(getPracticeType(songWithoutPractice)).toBe('none')
    })

    it('should prioritize videos over files if both exist', () => {
      const songWithBoth = {
        practiceVideos: { "합창": "url1" },
        practiceFiles: { "소프라노": { audioUrl: "url2" } }
      }
      expect(getPracticeType(songWithBoth)).toBe('videos')
    })
  })

  describe('isFirebaseUrl', () => {
    it('should return true for Firebase URLs', () => {
      expect(isFirebaseUrl('https://firebase-storage-url.com/scores/song1.pdf')).toBe(true)
      expect(isFirebaseUrl('http://example.com/file.pdf')).toBe(true)
    })

    it('should return false for local URLs', () => {
      expect(isFirebaseUrl('/data/song/score.pdf')).toBe(false)
      expect(isFirebaseUrl('./local/file.pdf')).toBe(false)
    })

    it('should return false for null or undefined', () => {
      expect(isFirebaseUrl(null)).toBe(false)
      expect(isFirebaseUrl(undefined)).toBe(false)
      expect(isFirebaseUrl('')).toBe(false)
    })
  })

  describe('isValidSong', () => {
    it('should return true for valid songs', () => {
      const validSong = { id: 1, title: "Test Song", date: "9/22" }
      expect(isValidSong(validSong)).toBe(true)
    })

    it('should return false for songs missing required fields', () => {
      expect(isValidSong({ title: "Test Song", date: "9/22" })).toBe(false) // missing id
      expect(isValidSong({ id: 1, date: "9/22" })).toBe(false) // missing title
      expect(isValidSong({ id: 1, title: "Test Song" })).toBe(false) // missing date
    })

    it('should return false for null or undefined', () => {
      expect(isValidSong(null)).toBe(false)
      expect(isValidSong(undefined)).toBe(false)
    })

    it('should return false for wrong data types', () => {
      expect(isValidSong({ id: "1", title: "Test Song", date: "9/22" })).toBe(false) // id should be number
      expect(isValidSong({ id: 1, title: 123, date: "9/22" })).toBe(false) // title should be string
      expect(isValidSong({ id: 1, title: "Test Song", date: 922 })).toBe(false) // date should be string
    })
  })
})





