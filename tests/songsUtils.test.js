import { describe, it, expect } from 'vitest'
import {
  createWeeklySongs,
  formatDate,
  hasPractice,
  hasScore,
  getYoutubeVideos,
  getAudioFiles,
  getPracticeType,
  isExternalUrl,
  isValidSong,
  VOICE_PART_LABELS
} from '../utils/songsUtils.js'

describe('songsUtils', () => {
  // 테스트용 샘플 데이터 (새 구조)
  const sampleSongs = [
    {
      id: "2024-09-22-강하고담대하라",
      date: "2024-09-22",
      title: "강하고 담대하라",
      composer: "김영광",
      voiceParts: ["soprano", "alto", "tenor", "bass"],
      score: {
        url: "https://firebase-storage-url.com/scores/song1.pdf",
        type: "pdf"
      },
      practice: {
        "합창": { type: "youtube", url: "https://youtu.be/qSKgDGN5FBM" },
        "soprano": { type: "youtube", url: "https://youtu.be/Fnvx0EC14v0" }
      }
    },
    {
      id: "2024-09-29-새노래로찬양",
      date: "2024-09-29",
      title: "새 노래로 찬양",
      composer: null,
      voiceParts: ["soprano", "alto", "tenor", "bass"],
      score: {
        url: "/data/새 노래로 찬양/score.pdf",
        type: "pdf"
      },
      practice: {
        "soprano": { type: "mp3", url: "/data/새 노래로 찬양/soprano.mp3" }
      }
    },
    {
      id: "2024-00-00-주님의은혜",
      date: null,
      title: "주님의 은혜",
      composer: null,
      voiceParts: ["soprano", "alto", "tenor", "bass"],
      score: null,
      practice: null
    }
  ]

  describe('formatDate', () => {
    it('should format ISO date to M/D format', () => {
      expect(formatDate("2024-09-22")).toBe("9/22")
      expect(formatDate("2024-12-25")).toBe("12/25")
    })

    it('should return "미정" for null date', () => {
      expect(formatDate(null)).toBe("미정")
    })
  })

  describe('createWeeklySongs', () => {
    it('should filter out songs with null date', () => {
      const result = createWeeklySongs(sampleSongs)
      expect(result).toHaveLength(2)
      expect(result.every(song => song.date !== null)).toBe(true)
    })

    it('should add weekLabel and displayDate to songs', () => {
      const result = createWeeklySongs(sampleSongs)
      expect(result[0].weekLabel).toBe('이번 주 찬양곡')
      expect(result[0].displayDate).toBe('9/22')
      expect(result[1].weekLabel).toBe('다음 주 찬양곡')
      expect(result[1].displayDate).toBe('9/29')
    })

    it('should sort songs by date', () => {
      const result = createWeeklySongs(sampleSongs)
      expect(result[0].title).toBe('강하고 담대하라')
      expect(result[1].title).toBe('새 노래로 찬양')
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

    it('should handle array with only null date songs', () => {
      const onlyNullDateSongs = [
        { id: "1", date: null, title: "Song 1" },
        { id: "2", date: null, title: "Song 2" }
      ]
      const result = createWeeklySongs(onlyNullDateSongs)
      expect(result).toHaveLength(0)
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

    it('should return false for songs with score object but no url', () => {
      const songWithEmptyScore = { score: { url: null } }
      expect(hasScore(songWithEmptyScore)).toBe(false)
    })
  })

  describe('hasPractice', () => {
    it('should return true for songs with practice', () => {
      const songWithPractice = sampleSongs[0]
      expect(hasPractice(songWithPractice)).toBe(true)
    })

    it('should return false for songs without practice', () => {
      const songWithoutPractice = sampleSongs[2]
      expect(hasPractice(songWithoutPractice)).toBe(false)
    })

    it('should return false for songs with empty practice', () => {
      const songWithEmptyPractice = { practice: {} }
      expect(hasPractice(songWithEmptyPractice)).toBe(false)
    })

    it('should return false for songs with null practice', () => {
      const songWithNullPractice = { practice: null }
      expect(hasPractice(songWithNullPractice)).toBe(false)
    })
  })

  describe('getYoutubeVideos', () => {
    it('should filter only youtube type practice items', () => {
      const practice = {
        "합창": { type: "youtube", url: "https://youtu.be/abc" },
        "soprano": { type: "mp3", url: "/data/soprano.mp3" }
      }
      const result = getYoutubeVideos(practice)
      expect(Object.keys(result)).toHaveLength(1)
      expect(result["합창"]).toBeDefined()
      expect(result["soprano"]).toBeUndefined()
    })

    it('should return empty object for null practice', () => {
      expect(getYoutubeVideos(null)).toEqual({})
    })
  })

  describe('getAudioFiles', () => {
    it('should filter only mp3/audio type practice items', () => {
      const practice = {
        "합창": { type: "youtube", url: "https://youtu.be/abc" },
        "soprano": { type: "mp3", url: "/data/soprano.mp3" }
      }
      const result = getAudioFiles(practice)
      expect(Object.keys(result)).toHaveLength(1)
      expect(result["soprano"]).toBeDefined()
      expect(result["합창"]).toBeUndefined()
    })

    it('should return empty object for null practice', () => {
      expect(getAudioFiles(null)).toEqual({})
    })
  })

  describe('getPracticeType', () => {
    it('should return "youtube" for songs with only youtube practice', () => {
      const songWithYoutube = {
        practice: {
          "합창": { type: "youtube", url: "url1" }
        }
      }
      expect(getPracticeType(songWithYoutube)).toBe('youtube')
    })

    it('should return "audio" for songs with only audio practice', () => {
      const songWithAudio = {
        practice: {
          "soprano": { type: "mp3", url: "url1" }
        }
      }
      expect(getPracticeType(songWithAudio)).toBe('audio')
    })

    it('should return "none" for songs without practice materials', () => {
      const songWithoutPractice = sampleSongs[2]
      expect(getPracticeType(songWithoutPractice)).toBe('none')
    })

    it('should return "mixed" if both youtube and audio exist', () => {
      const songWithBoth = {
        practice: {
          "합창": { type: "youtube", url: "url1" },
          "soprano": { type: "mp3", url: "url2" }
        }
      }
      expect(getPracticeType(songWithBoth)).toBe('mixed')
    })
  })

  describe('isExternalUrl', () => {
    it('should return true for external URLs', () => {
      expect(isExternalUrl('https://firebase-storage-url.com/scores/song1.pdf')).toBe(true)
      expect(isExternalUrl('http://example.com/file.pdf')).toBe(true)
    })

    it('should return false for local URLs', () => {
      expect(isExternalUrl('/data/song/score.pdf')).toBe(false)
      expect(isExternalUrl('./local/file.pdf')).toBe(false)
    })

    it('should return false for null or undefined', () => {
      expect(isExternalUrl(null)).toBe(false)
      expect(isExternalUrl(undefined)).toBe(false)
      expect(isExternalUrl('')).toBe(false)
    })
  })

  describe('isValidSong', () => {
    it('should return true for valid songs', () => {
      const validSong = { id: "test-id", title: "Test Song" }
      expect(isValidSong(validSong)).toBe(true)
    })

    it('should return false for songs missing required fields', () => {
      expect(isValidSong({ title: "Test Song" })).toBe(false) // missing id
      expect(isValidSong({ id: "test-id" })).toBe(false) // missing title
    })

    it('should return false for null or undefined', () => {
      expect(isValidSong(null)).toBe(false)
      expect(isValidSong(undefined)).toBe(false)
    })

    it('should return false for wrong data types', () => {
      expect(isValidSong({ id: 1, title: "Test Song" })).toBe(false) // id should be string
      expect(isValidSong({ id: "test-id", title: 123 })).toBe(false) // title should be string
    })
  })

  describe('VOICE_PART_LABELS', () => {
    it('should have correct Korean labels', () => {
      expect(VOICE_PART_LABELS.soprano).toBe('소프라노')
      expect(VOICE_PART_LABELS.alto).toBe('앨토')
      expect(VOICE_PART_LABELS.tenor).toBe('테너')
      expect(VOICE_PART_LABELS.bass).toBe('베이스')
    })
  })
})
