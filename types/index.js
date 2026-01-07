// Data type definitions for the choir management app

// Worship Song types
export const SongTypes = {
  SONG: 'song',
  CANTATA: 'cantata'
}

// Voice part types
export const VoiceParts = {
  SOPRANO: '소프라노',
  ALTO: '앨토',
  TENOR: '테너',
  BASS: '베이스'
}

// Member types
export const MemberTypes = {
  SAINT: '성도',
  DEACON: '집사',
  ELDER: '권사'
}

// Absence status types
export const AbsenceStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

// Meal signup status types
export const MealStatus = {
  OPEN: 'open',
  CONFIRMED: 'confirmed',
  FULL: 'full'
}

// Payment method types
export const PaymentMethods = {
  VENMO: 'venmo',
  ZELLE: 'zelle'
}

// Data structure examples (for reference)
export const DataStructures = {
  // Worship Song
  song: {
    id: 'string',
    date: 'string', // format: 'MM/DD'
    title: 'string',
    translation: 'string',
    type: 'string', // from SongTypes
    hasScore: 'boolean',
    hasAudio: 'boolean',
    voiceParts: 'array', // from VoiceParts
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  },

  // Announcement
  announcement: {
    id: 'string',
    date: 'string',
    title: 'string',
    content: 'string',
    details: 'object',
    notes: 'array',
    priority: 'string', // 'low', 'medium', 'high'
    isActive: 'boolean',
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  },

  // Absence
  absence: {
    id: 'string',
    memberId: 'string',
    memberName: 'string',
    voicePart: 'string', // from VoiceParts
    startDate: 'timestamp',
    endDate: 'timestamp',
    reason: 'string',
    status: 'string', // from AbsenceStatus
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  },

  // QT Sharing
  qtSharing: {
    id: 'string',
    date: 'string',
    memberId: 'string',
    memberName: 'string',
    memberType: 'string', // from MemberTypes
    bibleVerse: 'string',
    quote: 'string',
    content: 'string',
    likes: 'number',
    dislikes: 'number',
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  },

  // Meal Signup
  mealSignup: {
    id: 'string',
    date: 'string',
    members: 'array', // array of member names
    count: 'number',
    status: 'string', // from MealStatus
    notes: 'string',
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  },

  // Donation
  donation: {
    id: 'string',
    recipientId: 'string',
    recipientName: 'string',
    recipientHandle: 'string',
    paymentMethods: 'array', // from PaymentMethods
    qrCodes: 'object',
    bankDetails: 'object',
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  }
}



