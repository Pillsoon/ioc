# Irvine Onnuri Choir Backend Development Prompt

## Executive Summary

You are tasked with creating a complete Firebase backend for the **Irvine Onnuri Choir Management System**, a Nuxt 3-based web application designed to manage a Korean Christian choir community. This backend must support member management, worship song scheduling, announcements, absence tracking, and meal signups.

---

## Project Context

### Frontend Status
- **Framework**: Nuxt 3 (Vue 3) with SSR enabled
- **Language**: JavaScript/TypeScript
- **Styling**: Tailwind CSS
- **Currently**: Using mock JSON data (`/public/data/songs.json`, `/public/data/announcements.json`)
- **Port**: 5000 (development)
- **Target**: Replace mock data with Firebase backend

### Application Purpose
A choir management system for the Korean Christian church that handles:
- Worship song schedules and practice materials
- Member announcements and communications
- Absence tracking and approvals
- Meal signup coordination

### Key Requirements
1. **Korean Language Support**: All content is in Korean (한국어)
2. **Bilingual Authentication**: Support both Korean and English for member access
3. **File Storage**: Audio files, PDF scores, practice videos (YouTube links)
4. **Real-time Updates**: Live notifications and data synchronization
5. **Role-based Access**: Admin, choir leader, and member roles

**Note**: QT Sharing and Donation management features are excluded from the initial implementation.

---

## Firebase Architecture Requirements

### 1. Authentication System

**Auth Methods**:
- Email/Password authentication
- Support Korean and English email addresses
- Password requirements:
  - Minimum 8 characters
  - Must include letters and numbers
  - Korean characters allowed

**User Roles**:
```
ROLES:
1. admin (Administrator - Full system access)
2. choir_leader (성가대장 - Choir leader with elevated permissions)
3. saint (성도 - Regular member)
4. deacon (집사 - Deacon)
5. elder (권사 - Elder)
```

**User Profile Structure**:
```javascript
{
  uid: string,                    // Firebase Auth UID
  email: string,
  displayName: string,             // Full name (Korean name)
  englishName?: string,            // Optional English name
  phone?: string,
  role: 'admin' | 'choir_leader' | 'saint' | 'deacon' | 'elder',
  voicePart?: '소프라노' | '앨토' | '테너' | '베이스',  // Voice part
  memberType: '성도' | '집사' | '권사',
  profileImageUrl?: string,         // Storage URL
  createdAt: Timestamp,
  updatedAt: Timestamp,
  lastLoginAt: Timestamp,
  isActive: boolean
}
```

---

## 2. Firestore Collections & Data Models

### Collection: `songs` (찬양곡)

**Document Structure**:
```javascript
{
  id: string,                      // Auto-generated doc ID
  date: string,                    // Format: "MM/DD" or "미정"
  title: string,                   // Song title (Korean)
  titleNormalized: string,          // Normalized title for search (no spaces, lowercase)
  translation?: string,             // English translation
  composer?: string,                // Composer name
  composerNormalized?: string,      // Normalized composer for search
  type: 'song' | 'cantata',        // SongTypes enum
  voiceParts: Array<'소프라노' | '앨토' | '테너' | '베이스'>,
  hasScore: boolean,
  hasAudio: boolean,
  scoreUrl?: string,                // Firebase Storage URL or local path
  isYouTube: boolean,               // True if practiceVideos exist
  practiceVideos?: {               // YouTube video links
    합창?: string,                  // Full choir
    소프라노?: string,              // Soprano
    앨토?: string,                  // Alto
    테너?: string,                  // Tenor
    베이스?: string                 // Bass
  },
  practiceFiles?: {               // Audio files stored in Firebase Storage
    소프라노?: {
      audioUrl: string,
      fileType: 'mp3' | 'wav' | 'm4a'
    },
    앨토?: {...},
    테너?: {...},
    베이스?: {...}
  },
  notes?: string,
  // Search optimization fields
  searchKeywords: Array<string>,   // Preprocessed search keywords (n-grams)
  searchableText: string,           // Concatenated searchable text
  createdAt: Timestamp,
  updatedAt: Timestamp,
  createdBy: string,              // User UID
  updatedBy: string                // User UID
}
```

**Indexes Required**:
- `date` (ascending)
- `type` (ascending), `date` (ascending)
- `voiceParts` (array-contains), `date` (ascending)
- `searchKeywords` (array-contains) [Optional, for Option 2 search]

**Security Rules**:
```javascript
match /songs/{songId} {
  allow read: if true;  // Public read for choir members
  allow create: if request.auth != null && (isAdmin() || isChoirLeader());
  allow update: if request.auth != null && (isAdmin() || isChoirLeader());
  allow delete: if request.auth != null && isAdmin();
}

function isAdmin() {
  return request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}

function isChoirLeader() {
  return request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'choir_leader';
}
```

---

### Collection: `announcements` (공지사항)

**Document Structure**:
```javascript
{
  id: string,                      // Auto-generated doc ID
  date: string,                    // Format: "MM/DD"
  title: string,                   // Announcement title
  titleNormalized: string,         // Normalized title for search
  content: string,                 // Main content
  contentNormalized: string,       // Normalized content for search
  details?: {
    [key: string]: string          // Dynamic key-value pairs
    // Examples: 'top', 'bottom', 'shoes', 'practiceDate', 'location', etc.
  },
  notes?: Array<string>,           // Array of note strings
  priority: 'high' | 'medium' | 'low',  // Announcement priority
  isActive: boolean,               // Soft delete flag
  // Search optimization fields
  searchKeywords: Array<string>,   // Preprocessed search keywords
  searchableText: string,          // Concatenated searchable text (title + content)
  createdAt: Timestamp,
  updatedAt: Timestamp,
  createdBy: string,              // User UID
  updatedBy: string                // User UID
}
```

**Indexes Required**:
- `date` (descending)
- `priority` (ascending), `date` (descending)
- `isActive` (ascending), `date` (descending)
- `searchKeywords` (array-contains) [Optional, for Option 2 search]

**Security Rules**:
```javascript
match /announcements/{announcementId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null && (isAdmin() || isChoirLeader());
  allow update: if request.auth != null && (isAdmin() || isChoirLeader());
  allow delete: if request.auth != null && isAdmin();
}
```

---

### Collection: `annual_events` (연간 일정)

**⚠️ Design Rationale**: Instead of nesting all events in a single document with array fields, we use a flat document-per-event structure. This enables efficient queries by date range, event type, and search capabilities.

**Document Structure**:
```javascript
{
  id: string,                      // Auto-generated doc ID
  year: number,                    // e.g., 2024
  month: number,                    // 1-12 (for proper sorting)
  monthLabel: string,               // "2월", "4월", etc. (for display)
  eventDate: string,                // Specific date if available (e.g., "2/2", "10/5-6")
  eventTitle: string,               // Event title/description
  eventType?: string,               // Optional categorization (e.g., "신입모집", "수련회")
  details?: string,                // Additional details
  // New fields for efficient date-based queries
  sortKey: string,                  // "YYYY-MM-DD" format for sorting (computed from year, month, day if available)
  eventStartDate?: Timestamp,       // Actual event start date for proper date comparison
  isRecurring: boolean,            // true if event repeats annually
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**SortKey Examples**:
```javascript
// Full date known
{ year: 2024, month: 10, eventDate: "5(토) - 6(일)", sortKey: "2024-10-05" }

// Only month known, use first day
{ year: 2024, month: 2, eventDate: "2(일)", sortKey: "2024-02-02" }

// Monthly event without specific date (use mid-month)
{ year: 2024, month: 5, eventTitle: "성탄절 칸타타 연습 시작", sortKey: "2024-05-15" }
```

**Example Data**:
```javascript
// Document 1
{
  year: 2024,
  month: 2,
  monthLabel: "2월",
  eventDate: "2(일)",
  eventTitle: "1차 성가대 신입단원 모집",
  eventType: "신입모집"
}

// Document 2
{
  year: 2024,
  month: 2,
  monthLabel: "2월",
  eventDate: "9(일)",
  eventTitle: "2차 성가대 신입단원 모집",
  eventType: "신입모집"
}

// Document 3
{
  year: 2024,
  month: 10,
  monthLabel: "10월",
  eventDate: "5(토) - 6(일)",
  eventTitle: "가을 성가대 수련회",
  eventType: "수련회",
  details: "강화도 수련원"
}
```

**Indexes Required**:
- `year` (ascending), `month` (ascending)  // Primary query index
- `year` (ascending), `eventType` (ascending), `month` (ascending)  // Filter by event type
- `sortKey` (ascending)  // **Critical**: Enables efficient date-range queries
- `sortKey` (ascending), `eventType` (ascending)  // Filter by type with date sorting
- `searchKeywords` (array-contains) [Optional, for event search]

**Security Rules**:
```javascript
match /annual_events/{eventId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null && (isAdmin() || isChoirLeader());
  allow update: if request.auth != null && (isAdmin() || isChoirLeader());
  allow delete: if request.auth != null && isAdmin();
}
```

**Query Patterns**:
```javascript
// Query 1: Get all events for a specific year and month
async getEventsByMonth(year, month) {
  const q = query(
    collection(db, 'annual_events'),
    where('year', '==', year),
    where('month', '==', month),
    orderBy('eventDate', 'asc')
  )
  return await getDocs(q)
}

// Query 2: Get all events for a specific year
async getEventsByYear(year) {
  const q = query(
    collection(db, 'annual_events'),
    where('year', '==', year),
    orderBy('month', 'asc')
  )
  return await getDocs(q)
}

// Query 3: Get events by type (e.g., all 수련회 in 2024)
async getEventsByType(year, eventType) {
  const q = query(
    collection(db, 'annual_events'),
    where('year', '==', year),
    where('eventType', '==', eventType),
    orderBy('month', 'asc')
  )
  return await getDocs(q)
}

// Query 4: Search events by title (using searchKeywords)
async searchEvents(year, keyword) {
  const events = await getEventsByYear(year)
  return events.docs
    .map(doc => doc.data())
    .filter(event => 
      event.searchKeywords?.some(kw => kw.includes(keyword)) ||
      event.eventTitle.toLowerCase().includes(keyword.toLowerCase())
    )
}

// Query 5: Get upcoming events (MULTI-YEAR SUPPORT)
// Approach A: Using sortKey for efficient cross-year queries (RECOMMENDED)
async getUpcomingEvents(limit = 5, lookAheadYears = 2) {
  const today = new Date().toISOString().split('T')[0] // "YYYY-MM-DD"
  const futureDate = new Date()
  futureDate.setFullYear(futureDate.getFullYear() + lookAheadYears)
  const endDate = futureDate.toISOString().split('T')[0]
  
  // Single query across all years in range
  const q = query(
    collection(db, 'annual_events'),
    where('sortKey', '>=', today),
    where('sortKey', '<=', endDate),
    orderBy('sortKey', 'asc'),
    limit(limit)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data())
}

// Approach B: Multi-year queries in parallel (Alternative)
async getUpcomingEventsParallel(limit = 5, maxYears = 2) {
  const currentYear = new Date().getFullYear()
  const today = new Date().toISOString().split('T')[0]
  
  // Query multiple years in parallel
  const years = Array.from({ length: maxYears }, (_, i) => currentYear + i)
  const queries = years.map(year => 
    query(
      collection(db, 'annual_events'),
      where('year', '==', year),
      orderBy('month', 'asc')
    )
  )
  
  const snapshots = await Promise.all(queries.map(q => getDocs(q)))
  const allEvents = snapshots.flatMap(snapshot => snapshot.docs.map(doc => doc.data()))
  
  // Filter and sort by sortKey on client-side
  return allEvents
    .filter(event => event.sortKey >= today)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .slice(0, limit)
}

// Approach C: For very large datasets, use pagination with cursor
async getUpcomingEventsPaginated(limit = 5, lookAheadYears = 2) {
  const today = new Date().toISOString().split('T')[0]
  const futureDate = new Date()
  futureDate.setFullYear(futureDate.getFullYear() + lookAheadYears)
  const endDate = futureDate.toISOString().split('T')[0]
  
  const q = query(
    collection(db, 'annual_events'),
    where('sortKey', '>=', today),
    where('sortKey', '<=', endDate),
    orderBy('sortKey', 'asc'),
    limit(limit + 10) // Fetch slightly more for client-side filtering
  )
  
  const snapshot = await getDocs(q)
  const events = snapshot.docs.map(doc => doc.data())
  
  // Additional client-side filtering if needed
  const now = new Date().toISOString().split('T')[0]
  return events
    .filter(event => event.sortKey >= now)
    .slice(0, limit)
}

// Query 6: Get events between two dates (custom date range)
async getEventsByDateRange(startDate, endDate) {
  const q = query(
    collection(db, 'annual_events'),
    where('sortKey', '>=', startDate),
    where('sortKey', '<=', endDate),
    orderBy('sortKey', 'asc')
  )
  return await getDocs(q)
}

// Query 7: Get recurring events (events that repeat annually)
async getRecurringEvents(eventType, year) {
  // Query this year's events
  const q = query(
    collection(db, 'annual_events'),
    where('year', '==', year),
    where('eventType', '==', eventType),
    where('isRecurring', '==', true)
  )
  return await getDocs(q)
}
```

**Alternative: Subcollection Approach** (for even better organization):
```javascript
// Structure: annual_plans/{year}/events/{eventId}
{
  month: number,
  monthLabel: string,
  eventDate: string,
  eventTitle: string,
  eventType?: string
}

// Query example
async getEventsForYear(year) {
  return await getDocs(collection(db, `annual_plans/${year}/events`))
}
```

**Recommended Approaches for Multi-Year Queries**:

**Best Practice: Use Approach A (sortKey-based query)**
- ✅ **Single efficient Firestore query** - no client-side filtering needed
- ✅ **Cross-year support** - automatically includes events from multiple years
- ✅ **Indexed performance** - uses composite index on `sortKey`
- ✅ **Clean pagination** - Firestore handles sorting and limiting
- ⚠️ **Requires pre-computed sortKey** during document creation

**Use Approach B (parallel queries) only if**:
- You need to filter by year as a grouping criteria
- You want to show "this year" vs "next year" separate sections
- Your data volumes are small (< 500 events)

**Use Approach C (pagination) for**:
- Large datasets with thousands of events
- Implementing "Load More" functionality
- Memory-constrained environments

**Implementation Notes**:
1. Always compute `sortKey` when creating/updating events
2. Use `sortKey` format: "YYYY-MM-DD" (ISO 8601)
3. For month-only events, use mid-month date (e.g., "2024-05-15")
4. Create composite index: `sortKey` (ascending)
5. Query pattern: `where('sortKey', '>=', today) && where('sortKey', '<=', endDate)`

**Frontend Implementation Example**:
```javascript
// In pages/choir/notices.vue or similar
const upcomingEvents = ref([])

onMounted(async () => {
  // Fetch upcoming events across next 2 years
  upcomingEvents.value = await apiService.getUpcomingEvents(5, 2)
})
```

---

### Collection: `absences` (결석)

**Document Structure**:
```javascript
{
  id: string,
  memberId: string,               // User UID
  memberName: string,
  voicePart: '소프라노' | '앨토' | '테너' | '베이스',
  startDate: Timestamp,
  endDate: Timestamp,
  reason: string,                  // Absence reason
  status: 'pending' | 'approved' | 'rejected',  // AbsenceStatus
  reviewedBy?: string,            // UID of reviewer
  reviewedAt?: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes Required**:
- `memberId` (ascending), `status` (ascending)
- `status` (ascending), `startDate` (ascending)
- `voicePart` (ascending), `status` (ascending)

**Security Rules**:
```javascript
match /absences/{absenceId} {
  allow read: if request.auth != null && (resource.data.memberId == request.auth.uid || isAdmin() || isChoirLeader());
  allow create: if request.auth != null;
  allow update: if request.auth != null && (resource.data.memberId == request.auth.uid || isAdmin() || isChoirLeader());
  allow delete: if request.auth != null && isAdmin();
}
```

---

### Collection: `meal_signups` (식사 신청)

**⚠️ Critical Design Consideration**: This collection faces concurrent update challenges when multiple users sign up simultaneously. The current array-based structure can lead to race conditions.

**Document Structure** (Current):
```javascript
{
  id: string,
  date: string,                    // Format: "YYYY-MM-DD"
  members: Array<{
    memberId: string,
    memberName: string,
    signedUpAt: Timestamp
  }>,
  count: number,                   // Current number of signups
  capacity: number,                // Maximum capacity (used in transactions)
  status: 'open' | 'confirmed' | 'full',
  notes?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  createdBy: string,              // User UID
  updatedBy: string
}
```

**Problem**: 
- User A and User B both read the document at the same time (count: 5)
- User A adds themselves (count: 6)
- User B adds themselves (count: 6) ← Wrong! Should be 7
- Data loss occurs

**Recommended Solution: Use Firestore Transactions**

**Security Rules**:
```javascript
match /meal_signups/{signupId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
  // Transactions require both create and update permissions
  allow update: if request.auth != null;
  allow delete: if request.auth != null && isAdmin();
}
```

**Concurrent-Safe Implementation Patterns**:

**Pattern 1: Firestore Transactions (RECOMMENDED)**
```javascript
import { runTransaction, arrayUnion, increment } from 'firebase/firestore'

async signUpForMeal(mealId, memberId, memberName) {
  const mealRef = doc(db, 'meal_signups', mealId)
  
  try {
    await runTransaction(db, async (transaction) => {
      // Read current state
      const mealDoc = await transaction.get(mealRef)
      
      if (!mealDoc.exists()) {
        throw new Error('Meal signup not found')
      }
      
      const mealData = mealDoc.data()
      
      // Check if already signed up
      const isSignedUp = mealData.members?.some(m => m.memberId === memberId)
      if (isSignedUp) {
        throw new Error('Already signed up')
      }
      
      // Check capacity (if limit exists)
      if (mealData.count >= mealData.capacity) {
        throw new Error('Meal signup is full')
      }
      
      // Atomic update: add member AND increment count in single operation
      transaction.update(mealRef, {
        members: arrayUnion({
          memberId,
          memberName,
          signedUpAt: serverTimestamp()
        }),
        count: increment(1),  // Atomic counter increment
        updatedAt: serverTimestamp(),
        updatedBy: memberId
      })
    })
    
    return { success: true }
  } catch (error) {
    console.error('Transaction failed:', error)
    return { success: false, error: error.message }
  }
}

async cancelMealSignup(mealId, memberId) {
  const mealRef = doc(db, 'meal_signups', mealId)
  
  try {
    await runTransaction(db, async (transaction) => {
      const mealDoc = await transaction.get(mealRef)
      if (!mealDoc.exists()) {
        throw new Error('Meal signup not found')
      }
      
      const mealData = mealDoc.data()
      const updatedMembers = mealData.members.filter(m => m.memberId !== memberId)
      
      if (updatedMembers.length === mealData.members.length) {
        throw new Error('Not signed up for this meal')
      }
      
      transaction.update(mealRef, {
        members: updatedMembers,
        count: increment(-1),  // Atomic decrement
        updatedAt: serverTimestamp(),
        updatedBy: memberId
      })
    })
    
    return { success: true }
  } catch (error) {
    console.error('Transaction failed:', error)
    return { success: false, error: error.message }
  }
}
```

**Pattern 2: Use Subcollections (Alternative for High Concurrency)**
```javascript
// Collection: meal_signups/{mealId}/members/{memberId}
// Document: member
{
  memberId: string,
  memberName: string,
  signedUpAt: Timestamp
}

// Update main document separately
{
  id: string,
  date: string,
  count: number,  // Updated separately via transaction
  status: 'open' | 'confirmed' | 'full',
  notes?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

// Implementation
async signUpForMealSubcollection(mealId, memberId, memberName) {
  const memberRef = doc(db, `meal_signups/${mealId}/members/${memberId}`)
  const mealRef = doc(db, 'meal_signups', mealId)
  
  try {
    await runTransaction(db, async (transaction) => {
      // Check if member already exists
      const memberDoc = await transaction.get(memberRef)
      if (memberDoc.exists()) {
        throw new Error('Already signed up')
      }
      
      // Check capacity
      const mealDoc = await transaction.get(mealRef)
      const mealData = mealDoc.data()
      if (mealData.count >= mealData.capacity) {
        throw new Error('Meal is full')
      }
      
      // Create member sub-document
      transaction.set(memberRef, {
        memberId,
        memberName,
        signedUpAt: serverTimestamp()
      })
      
      // Update count
      transaction.update(mealRef, {
        count: increment(1),
        updatedAt: serverTimestamp()
      })
    })
    
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

**Pattern 3: Optimistic Concurrency with Field Timestamps**
```javascript
{
  id: string,
  date: string,
  members: Array<{...}>,
  count: number,
  lastModified: Timestamp,  // Add this field
  version: number,          // Optimistic locking version
  ...
}

// When updating, check version hasn't changed
async signUpWithOptimisticLock(mealId, memberId, memberName, expectedVersion) {
  const mealRef = doc(db, 'meal_signups', mealId)
  
  try {
    await runTransaction(db, async (transaction) => {
      const mealDoc = await transaction.get(mealRef)
      const currentVersion = mealDoc.data().version
      
      if (currentVersion !== expectedVersion) {
        throw new Error('Document was modified by another user. Please refresh.')
      }
      
      // Proceed with update...
      transaction.update(mealRef, {
        members: arrayUnion({...}),
        count: increment(1),
        version: currentVersion + 1,  // Increment version
        lastModified: serverTimestamp()
      })
    })
    
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

**Recommended Approach**:
- **For MVP**: Use **Pattern 1** (Transactions with arrayUnion + increment)
- **For Production with high concurrency**: Use **Pattern 2** (Subcollections)
- **Only use Pattern 3** if you need custom conflict resolution logic

**Key Benefits**:
1. ✅ **Atomic operations** - Either entire signup succeeds or fails (no partial updates)
2. ✅ **Automatic retries** - Firestore handles transaction conflicts automatically
3. ✅ **Consistency guarantee** - Read-and-write operations are atomic
4. ✅ **No race conditions** - Multiple simultaneous signups won't cause data loss

---

## 3. Firebase Storage Structure

**Storage Bucket Organization**:
```
/audio/{songId}/{voicePart}.{ext}         // Practice audio files
/scores/{songId}/score.pdf                 // PDF scores
/images/profile/{userId}.{ext}            // Profile images
```

**Storage Security Rules**:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Audio files - public read, admin write
    match /audio/{songId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin();
    }
    
    // PDF scores - public read, admin write
    match /scores/{songId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin();
    }
    
    // Profile images - authenticated read, owner write
    match /images/profile/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 4. Firebase App Check Configuration

**⚠️ CRITICAL SECURITY**: App Check protects your Firebase backend from abuse by verifying requests come from your authentic app. It prevents bot traffic, abuse, and unauthorized access.

### 4.1 Why App Check is Essential

Without App Check:
- ❌ Bots can scrape your data
- ❌ Malicious users can abuse your quota/costs
- ❌ Firestore Security Rules can be bypassed with stolen credentials
- ❌ Storage can be abused for illegal content

With App Check:
- ✅ Only legitimate app instances can access Firebase
- ✅ Reduced risk of cost abuse
- ✅ Protection against automated attacks
- ✅ Token verification on every request

### 4.2 Web App Check Setup (Nuxt 3)

**Step 1: Install Dependencies**
```bash
npm install firebase firebase-admin
npm install -D @types/node
```

**Step 2: Firebase Console Configuration**

1. Go to Firebase Console → Project Settings → App Check
2. Click "Get started" on Web Apps
3. Choose **reCAPTCHA Enterprise** (recommended for production) or **reCAPTCHA v3** (development)
4. Register your domain (e.g., `irvine-choir.firebaseapp.com`)
5. Copy the **reCAPTCHA Enterprise Site Key**

**Step 3: Environment Variables**
```bash
# .env
VITE_FIREBASE_API_KEY=your_key_here
VITE_RECAPTCHA_ENTERPRISE_SITE_KEY=your_site_key_here
# ... other Firebase config
```

**Step 4: Create App Check Plugin (`plugins/firebase-app-check.client.js`)**
```javascript
import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  
  // Check if we're in browser and not in dev mode
  if (process.client && config.public.appEnvironment === 'production') {
    try {
      // Initialize Firebase App Check
      const appCheck = initializeAppCheck(undefined, {
        provider: new ReCaptchaEnterpriseProvider(
          config.public.reCaptchaEnterpriseSiteKey
        ),
        isTokenAutoRefreshEnabled: true // Auto-refresh tokens
      })
      
      console.log('✅ Firebase App Check initialized')
    } catch (error) {
      console.error('❌ App Check initialization failed:', error)
    }
  } else if (process.client) {
    // Development mode: Mock App Check token
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true
    console.log('🔧 App Check DEBUG mode enabled')
  }
})
```

**Step 5: Update Firebase Config (`plugins/firebase.client.js`)**
```javascript
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId
  }
  
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  const auth = getAuth(app)
  const storage = getStorage(app)
  
  return {
    provide: {
      firebase: app,
      db,
      auth,
      storage
    }
  }
})
```

**Step 6: Update `nuxt.config.ts`**
```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.VITE_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.VITE_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.VITE_FIREBASE_APP_ID,
      reCaptchaEnterpriseSiteKey: process.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY,
      appEnvironment: process.env.VITE_APP_ENVIRONMENT || 'development'
    }
  },
  
  // ... other config
})
```

### 4.3 Mobile App Check Setup (Future iOS/Android)

**iOS Implementation**:
```swift
// AppDelegate.swift
import Firebase
import FirebaseAppCheck

func application(_ application: UIApplication,
                   didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
  
  // Configure App Attest provider
  let providerFactory = AppAttestProviderFactory()
  AppCheck.setAppCheckProviderFactory(providerFactory)
  
  FirebaseApp.configure()
  
  return true
}
```

**Android Implementation**:
```java
// MainActivity.kt
import com.google.firebase.appcheck.debug.DebugAppCheckProviderFactory
import com.google.firebase.appcheck.playintegrity.PlayIntegrityAppCheckProviderFactory
import com.google.firebase.FirebaseApp
import com.google.firebase.appcheck.FirebaseAppCheck

class MainActivity : AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    // Production: Play Integrity
    FirebaseAppCheck.initializeApp(
      applicationContext,
      PlayIntegrityAppCheckProviderFactory.getInstance()
    )
    
    // Development: Debug provider
    if (BuildConfig.DEBUG) {
      FirebaseAppCheck.getInstance().installAppCheckProviderFactory(
        DebugAppCheckProviderFactory.getInstance()
      )
    }
    
    FirebaseApp.initializeApp(this)
  }
}
```

### 4.4 Backend Security Rules Integration

**Update Firestore Security Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to verify App Check
    function isRequestFromValidApp() {
      return request.auth != null 
        && (request.auth.token.firebase.sign_in_provider == 'custom' 
            || request.auth.token.firebase.sign_in_provider == 'password');
    }
    
    // Songs collection
    match /songs/{songId} {
      allow read: if true;
      allow create: if isRequestFromValidApp() && (isAdmin() || isChoirLeader());
      allow update: if isRequestFromValidApp() && (isAdmin() || isChoirLeader());
      allow delete: if isRequestFromValidApp() && isAdmin();
    }
    
    // Meal signups - use App Check for production
    match /meal_signups/{signupId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && isAdmin();
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow create: if isRequestFromValidApp();
    }
    
    // ... other collections
  }
}
```

### 4.5 Testing App Check

**Development Testing**:
```javascript
// Use this in your browser console during development
self.FIREBASE_APPCHECK_DEBUG_TOKEN = 'your-debug-token-from-console-log'

// Check if App Check is working
console.log('App Check debug mode:', !!self.FIREBASE_APPCHECK_DEBUG_TOKEN)
```

**Production Verification**:
1. Deploy app Check to Firebase
2. Test in production environment
3. Monitor App Check dashboard for token attestations
4. Check security logs for failed attestations

### 4.6 Monitoring & Alerts

**Setup Alerts in Firebase Console**:
1. Go to App Check dashboard
2. Enable "App Check attestation failures" alerts
3. Set up cloud logging to track abuse attempts
4. Monitor quota usage for suspicious spikes

**Example Monitoring Query**:
```javascript
// Cloud Functions: Monitor App Check failures
export const monitorAppCheckFailures = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    // Query logs for App Check failures
    const failures = await getAppCheckFailureLogs()
    
    if (failures.length > 100) {
      // Send alert to admin
      await sendAlertToAdmin('High App Check failure rate detected')
    }
  })
```

### 4.7 Troubleshooting

**Common Issues**:

1. **Token refresh failures**
   - Solution: Implement retry logic with exponential backoff
   ```javascript
   async function refreshAppCheckToken(maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         await getAppCheckToken()
         return true
       } catch (error) {
         await sleep(1000 * Math.pow(2, i)) // Exponential backoff
       }
     }
     throw new Error('Failed to refresh App Check token')
   }
   ```

2. **reCAPTCHA not loading**
   - Check domain registration in Firebase Console
   - Verify site key is correct
   - Check browser console for CORS errors

3. **Development mode not working**
   - Ensure `FIREBASE_APPCHECK_DEBUG_TOKEN` is set
   - Check Firebase Console for debug token registration

### 4.8 Rollout Strategy

**Phase 1: Development** (Immediate)
- Enable debug mode locally
- Test all API calls work with App Check
- Verify token generation/refresh

**Phase 2: Staging** (Week 1-2)
- Configure reCAPTCHA Enterprise on staging domain
- Test with staging database
- Monitor failure rates

**Phase 3: Production Beta** (Week 3)
- Enable for admin users only
- Monitor closely for issues
- Gradually rollout to all users

**Phase 4: Full Production** (Week 4+)
- Enable App Check enforcement in security rules
- Monitor dashboard for abuse attempts
- Keep debug mode disabled

---

## 5. Environment Variables for Frontend

**Required Environment Variables**:
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id

# App Check Configuration
VITE_RECAPTCHA_ENTERPRISE_SITE_KEY=your_site_key_here

# App Configuration
VITE_APP_NAME=Irvine Onnuri Choir
VITE_API_BASE_URL=https://your-project.firebaseapp.com
VITE_APP_ENVIRONMENT=production
```

---

## 7. API Integration Specifications

### Frontend API Service Structure

The frontend expects these service methods to exist in `composables/useApi.js`:

**Authentication Methods**:
```javascript
// Auth operations
async signIn(email, password)
async signOut()
async getCurrentUser()
async updateProfile(updates)
```

**Song Operations**:
```javascript
// Song CRUD
async getSongs()                              // Returns all songs
async getSong(songId)                         // Returns single song
async createSong(songData)                    // Auto-generates searchKeywords
async updateSong(songId, updates)            // Auto-updates searchKeywords
async deleteSong(songId)
async uploadScore(songId, file)               // Upload PDF to Storage
async uploadPracticeFile(songId, voicePart, file)  // Upload audio to Storage

// Search operations
async searchSongs(query)                     // Client-side search (Option 1)
async searchSongsByKeywords(keywords)         // Firestore array-contains (Option 2)
```

**Announcement Operations**:
```javascript
// Announcement CRUD
async getAnnouncements()                      // Returns active announcements
async getAllAnnouncements()                  // Includes inactive
async getAnnouncement(announcementId)
async createAnnouncement(announcementData)   // Auto-generates searchKeywords
async updateAnnouncement(announcementId, updates)  // Auto-updates searchKeywords
async deleteAnnouncement(announcementId)
async toggleAnnouncementStatus(announcementId)

// Search operations
async searchAnnouncements(query)             // Client-side search
async searchAnnouncementsByKeywords(keywords)  // Firestore array-contains search
```

**Absence Operations**:
```javascript
// Absence CRUD
async getMyAbsences()                         // Current user's absences
async getAllAbsences()                       // Admin/Leader only
async createAbsence(absenceData)
async updateAbsenceStatus(absenceId, status, reviewNotes)
async deleteAbsence(absenceId)
```

**Meal Signup Operations**:
```javascript
// Meal Signup CRUD
async getMealSignups()                       // Get all meal signups
async getMealSignup(mealId)                 // Get single meal signup with members
async signUpForMeal(mealId, memberId, memberName)     // Use TRANSACTIONS (concurrent-safe)
async cancelMealSignup(mealId, memberId)            // Use TRANSACTIONS (concurrent-safe)
async createMealSignup(mealData)
async updateMealStatus(mealId, status)              // Open/Confirmed/Full
async checkAvailable(mealId)                         // Check if meal has capacity

// Subcollection approach (for high concurrency)
async getMealMembers(mealId)                // Get members subcollection
```

**Annual Events Operations**:
```javascript
// Annual Events CRUD
async getEventsByYear(year)                               // Get all events for a year
async getEventsByMonth(year, month)                      // Get events for specific month
async getEventsByType(year, eventType)                   // Filter by event type
async getUpcomingEvents(limit?, lookAheadYears?)        // Get next N upcoming events across multiple years
async getEventsByDateRange(startDate, endDate)           // Get events within date range
async getRecurringEvents(eventType, year)                // Get recurring annual events
async getEvent(eventId)
async createEvent(eventData)                            // Auto-generates sortKey
async updateEvent(eventId, updates)                     // Auto-updates sortKey
async deleteEvent(eventId)

// Search operations
async searchEvents(year, keyword)                       // Search events by keyword
```

### Expected Response Formats

**Success Response**:
```javascript
{
  success: true,
  data: {...},  // Response data
  timestamp: Timestamp
}
```

**Error Response**:
```javascript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  },
  timestamp: Timestamp
}
```

---

## 8. Critical Implementation Notes

### Date Handling
- **Format**: Use "MM/DD" for display dates (songs, announcements)
- **Storage**: Store full timestamps in Firestore Timestamp format
- **Timezone**: Pacific Time (US) - consider timezone handling for Korean users

### Korean Character Support & Search Strategy

**⚠️ Critical Limitation**: Firestore does NOT support full-text search. Implementing efficient Korean text search requires additional strategy.

**Field Additions for Search**:
Add searchable text fields to `songs` and `announcements` documents:

```javascript
// Songs document enhancements
{
  // ... existing fields ...
  searchKeywords: Array<string>,        // Preprocessed search terms
  searchableText: string,                // Lowercase, normalized text for filtering
  titleNormalized: string,              // Lowercase Korean title
  composerNormalized?: string           // Lowercase composer name
}

// Example:
{
  title: "새 노래로 찬양",
  titleNormalized: "새노래로찬양",      // Remove spaces, lowercase
  searchKeywords: ["새", "노래", "찬양", "새노래", "새노래로", "노래로", "찬양"],
  searchableText: "새노래로찬양 새 노래로 찬양 praise new song"
}
```

**Search Implementation Strategy** (choose ONE):

**Option 1: Client-Side Filtering (Recommended for MVP)**
```javascript
// In frontend: composables/useApi.js
async searchSongs(query) {
  const allSongs = await getSongs()
  const normalizedQuery = normalizeKorean(query)
  
  return allSongs.filter(song => 
    song.titleNormalized.includes(normalizedQuery) ||
    song.searchKeywords.some(keyword => keyword.includes(normalizedQuery)) ||
    song.composer?.toLowerCase().includes(query.toLowerCase())
  )
}

function normalizeKorean(text) {
  return text
    .toLowerCase()
    .replace(/\s/g, '')              // Remove spaces
    .normalize('NFC')                // Normalize Unicode
}

// Usage in pages/choir/songs.vue
const searchQuery = ref('')
const filteredSongs = computed(() => {
  if (!searchQuery.value) return songs.value
  return apiService.searchSongs(searchQuery.value)
})
```

**Pros**: 
- ✅ No additional services
- ✅ Fast for small datasets (< 1000 items)
- ✅ Real-time filtering

**Cons**: 
- ❌ Fetches all documents
- ❌ Limited to exact substring matching
- ❌ Performance degrades with >1000 items

**Option 2: Firestore Query-Based Filtering (Hybrid)**
```javascript
// Use array-contains for multi-word search
async searchSongsByKeywords(keywords) {
  const searchTerms = extractKoreanTokens(keywords)
  
  // Query Firestore for ANY keyword match
  const queries = searchTerms.map(term => 
    query(collection(db, 'songs'), 
      where('searchKeywords', 'array-contains', term)
    )
  )
  
  const results = await Promise.all(queries)
  return mergeUniqueResults(results)
}

function extractKoreanTokens(text) {
  // Extract Korean words, English words, and numbers
  const koreanRegex = /[가-힣]+/g
  const englishRegex = /\b[a-z]+\b/gi
  const numbers = /\d+/g
  
  return [
    ...text.match(koreanRegex) || [],
    ...text.match(englishRegex) || [],
    ...text.match(numbers) || []
  ]
}
```

**Pros**: 
- ✅ Uses Firestore indexes
- ✅ More efficient for large datasets
- ✅ Server-side filtering

**Cons**: 
- ❌ Requires preprocessing during document creation
- ❌ Limited matching flexibility
- ❌ Multiple queries needed for multi-word search

**Option 3: External Search Service (Future Enhancement)**
```javascript
// Use Algolia or Elasticsearch for production
import algoliasearch from 'algoliasearch/lite'

const searchClient = algoliasearch(appId, apiKey)

async searchSongs(query) {
  const { hits } = await searchClient.search([
    {
      indexName: 'songs',
      query: query,
      params: {
        hitsPerPage: 50,
        attributesToRetrieve: ['*'],
        typoTolerance: false  // Important for Korean
      }
    }
  ])
  return hits
}
```

**Pros**: 
- ✅ Professional full-text search
- ✅ Korean language analysis
- ✅ Typo tolerance, relevance ranking
- ✅ Scales to millions of documents

**Cons**: 
- ❌ Additional cost (~$10-50/month)
- ❌ Requires data sync between Firestore and Algolia
- ❌ Setup complexity

**Recommended Approach for MVP**: 
1. **Start with Option 1** (client-side filtering)
2. Add `searchKeywords` preprocessing during document creation
3. Implement simplified version of Option 2 for basic keyword matching
4. **Plan migration to Option 3** when dataset grows > 1000 items

**Data Preprocessing Rules**:
```javascript
function generateSearchKeywords(koreanText) {
  // 1. Split into words
  const words = koreanText.split(/\s+/)
  
  // 2. Generate n-grams for Korean (bi-grams, tri-grams)
  const ngrams = []
  const textWithoutSpaces = words.join('')
  
  // Bigrams (2-char combinations)
  for (let i = 0; i <= textWithoutSpaces.length - 2; i++) {
    ngrams.push(textWithoutSpaces.substr(i, 2))
  }
  
  // Trigrams (3-char combinations)
  for (let i = 0; i <= textWithoutSpaces.length - 3; i++) {
    ngrams.push(textWithoutSpaces.substr(i, 3))
  }
  
  return [...new Set([...words, ...ngrams])]  // Deduplicate
}

// Example: "새 노래로 찬양"
// Keywords: ["새", "노래로", "찬양", "새노", "노래", "래로", "로찬", "찬양", "새노래", "노래로찬", "래로찬양"]
```

**Required Implementation Steps**:
1. Update data models to include `searchKeywords` array
2. Preprocess during document creation/update
3. Implement client-side search utility function
4. Add search UI with debounced input
5. Monitor performance and plan for Algolia migration when needed

### Real-time Updates
- Use Firestore listeners (`onSnapshot`) for real-time data sync
- Implement pagination for large datasets
- Add query caching strategies

### Security Best Practices
1. Always validate user roles in security rules
2. Implement server-side validation for all writes
3. Use Firebase App Check for additional security
4. Enable rate limiting on write operations
5. Log all admin actions for audit trails

### Performance Optimizations
1. Implement composite indexes for complex queries
2. Use Firestore batch operations for bulk updates
3. Implement pagination (startAfter, limit) for large collections
4. Cache frequently accessed data on client-side
5. Use Firestore offline persistence

### Concurrent Updates & Race Condition Prevention

**⚠️ CRITICAL**: The `meal_signups` collection requires special handling for concurrent updates.

**Problems without Transactions**:
- Multiple users signing up simultaneously can overwrite each other's changes
- Counter fields (`count`) can become inconsistent
- Array updates can lose data

**Required Implementations**:
1. **Use Firestore Transactions** for all `signUpForMeal()` and `cancelMealSignup()` operations
2. **Import Firebase SDK functions**: `runTransaction`, `arrayUnion`, `increment`, `serverTimestamp`
3. **Handle transaction retries** - Firestore automatically retries up to 5 times
4. **Validate capacity** inside transaction before incrementing count
5. **Use `arrayUnion()` instead of manual array pushes** for atomic member additions

**Example Safe Pattern**:
```javascript
import { runTransaction, doc, arrayUnion, increment, serverTimestamp } from 'firebase/firestore'

// ALWAYS use this pattern for meal signups
await runTransaction(db, async (transaction) => {
  // Read
  const meal = await transaction.get(mealRef)
  // Validate
  if (meal.data().count >= capacity) throw new Error('Full')
  // Atomic update
  transaction.update(mealRef, {
    members: arrayUnion({ memberId, memberName }),
    count: increment(1)
  })
})
```

**Collections Requiring Transactions**:
- ✅ `meal_signups` - Member signups and count updates
- ⚠️ Any collection with counter fields that update frequently
- ⚠️ Any collection with array fields that multiple users modify

**Collections NOT Requiring Transactions**:
- ✅ `songs` - Admin-only updates (low concurrency)
- ✅ `announcements` - Admin-only updates (low concurrency)
- ✅ `absences` - Single user creating/modifying their own absences
- ✅ `annual_events` - Admin-only updates

### Data Preprocessing & Utility Functions

**⚠️ CRITICAL**: Search keyword generation and date parsing must be consistent across all document updates.

#### 1. Search Keyword Preprocessing Strategy

**Recommendation: Hybrid Approach (Client-side with Cloud Function Validation)**

**Why NOT pure client-side**:
- ❌ Users could bypass preprocessing
- ❌ Inconsistent keyword formats across clients
- ❌ Client-side code exposure

**Why NOT pure Cloud Function**:
- ❌ Extra latency on every write
- ❌ Additional costs (Cloud Function invocations)
- ❌ Over-engineering for MVP

**Best Approach: Client-side preprocessing + Cloud Function onUpdate trigger**

**Client-Side Implementation** (`composables/searchUtils.js`):
```javascript
/**
 * Generate search keywords from Korean text using n-grams
 * @param {string} text - Korean text to process
 * @returns {Array<string>} - Array of searchable keywords
 */
export function generateSearchKeywords(text) {
  if (!text || typeof text !== 'string') return []
  
  // 1. Normalize text (remove spaces, lowercase)
  const normalized = text
    .toLowerCase()
    .replace(/\s+/g, '')              // Remove all spaces
    .normalize('NFC')                // Normalize Unicode
  
  // 2. Extract Korean words
  const koreanWords = text.match(/[가-힣]+/g) || []
  
  // 3. Generate n-grams (bi-grams and tri-grams for Korean)
  const ngrams = []
  
  // Bigrams (2-character combinations)
  for (let i = 0; i <= normalized.length - 2; i++) {
    const bigram = normalized.substr(i, 2)
    if (/[가-힣]{2}/.test(bigram)) {  // Only if both chars are Korean
      ngrams.push(bigram)
    }
  }
  
  // Trigrams (3-character combinations)
  for (let i = 0; i <= normalized.length - 3; i++) {
    const trigram = normalized.substr(i, 3)
    if (/[가-힣]{3}/.test(trigram)) {
      ngrams.push(trigram)
    }
  }
  
  // 4. Also extract English words if present
  const englishWords = text.match(/\b[a-z]+\b/gi) || []
  
  // 5. Deduplicate and return
  const allKeywords = [...new Set([
    ...koreanWords,
    ...englishWords,
    ...ngrams
  ])]
  
  return allKeywords
}

/**
 * Normalize Korean text for consistent search
 * @param {string} text - Text to normalize
 * @returns {string} - Normalized text
 */
export function normalizeKorean(text) {
  return text
    .toLowerCase()
    .replace(/\s/g, '')
    .normalize('NFC')
}

/**
 * Extract tokens from mixed Korean/English input
 * @param {string} text - Input text
 * @returns {Array<string>} - Extracted tokens
 */
export function extractKoreanTokens(text) {
  const koreanRegex = /[가-힣]+/g
  const englishRegex = /\b[a-z]+\b/gi
  const numbers = /\d+/g
  
  return [
    ...(text.match(koreanRegex) || []),
    ...(text.match(englishRegex) || []),
    ...(text.match(numbers) || [])
  ]
}
```

**Usage in CRUD Operations** (`composables/useApi.js`):
```javascript
import { generateSearchKeywords, normalizeKorean } from '~/composables/searchUtils.js'

async createSong(songData) {
  // Auto-generate search fields on client-side
  const processedData = {
    ...songData,
    titleNormalized: normalizeKorean(songData.title),
    composerNormalized: songData.composer ? normalizeKorean(songData.composer) : undefined,
    searchKeywords: [
      ...generateSearchKeywords(songData.title),
      ...(songData.composer ? generateSearchKeywords(songData.composer) : [])
    ],
    searchableText: `${songData.title} ${songData.composer || ''}`.toLowerCase()
  }
  
  return await this.create('songs', processedData)
}

async updateSong(songId, updates) {
  // Auto-update search fields if title/composer changed
  if (updates.title || updates.composer) {
    const currentDoc = await this.read('songs', songId)
    const updatedTitle = updates.title || currentDoc.title
    const updatedComposer = updates.composer !== undefined ? updates.composer : currentDoc.composer
    
    updates.titleNormalized = normalizeKorean(updatedTitle)
    if (updatedComposer) {
      updates.composerNormalized = normalizeKorean(updatedComposer)
    }
    updates.searchKeywords = [
      ...generateSearchKeywords(updatedTitle),
      ...(updatedComposer ? generateSearchKeywords(updatedComposer) : [])
    ]
    updates.searchableText = `${updatedTitle} ${updatedComposer || ''}`.toLowerCase()
  }
  
  return await this.update('songs', songId, updates)
}
```

**Cloud Function for Validation** (`functions/src/index.ts`):
```typescript
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Trigger on document create/update to ensure search fields are present
export const validateSearchFields = functions.firestore
  .document('songs/{songId}')
  .onWrite(async (change, context) => {
    const data = change.after.data()
    
    if (!data) return null // Document deleted
    
    // Validate search fields exist
    if (!data.searchKeywords || !data.titleNormalized) {
      console.log(`⚠️ Missing search fields for song ${context.params.songId}`)
      
      // Auto-generate missing fields
      const updates = generateSearchFields(data)
      
      return change.after.ref.update(updates)
    }
    
    return null
  })
```

#### 2. Date Parsing for annual_events sortKey

**Implementation**: Parse ambiguous date strings reliably

**Date Parsing Utility** (`composables/dateUtils.js`):
```javascript
/**
 * Parse Korean date strings to ISO format
 * Handles ambiguous formats like "5(토) - 6(일)", "2/2", "미정"
 */
export function parseEventDate(eventDate, year, month) {
  if (!eventDate || eventDate === '미정') {
    // Return mid-month date for month-only events
    const day = 15
    const paddedMonth = String(month).padStart(2, '0')
    return {
      sortKey: `${year}-${paddedMonth}-${String(day).padStart(2, '0')}`,
      eventStartDate: new Date(year, month - 1, day),
      eventEndDate: null
    }
  }
  
  // Parse "5(토) - 6(일)" format
  if (eventDate.includes('(') && eventDate.includes(')')) {
    const match = eventDate.match(/(\d+)\s*[-~]\s*(\d+)/)
    
    if (match) {
      // Start and end dates
      const startDay = parseInt(match[1])
      const endDay = parseInt(match[2])
      
      const paddedMonth = String(month).padStart(2, '0')
      return {
        sortKey: `${year}-${paddedMonth}-${String(startDay).padStart(2, '0')}`,
        eventStartDate: new Date(year, month - 1, startDay),
        eventEndDate: new Date(year, month - 1, endDay)
      }
    } else {
      // Single date "5(토)"
      const match2 = eventDate.match(/(\d+)/)
      if (match2) {
        const day = parseInt(match2[1])
        const paddedMonth = String(month).padStart(2, '0')
        return {
          sortKey: `${year}-${paddedMonth}-${String(day).padStart(2, '0')}`,
          eventStartDate: new Date(year, month - 1, day),
          eventEndDate: null
        }
      }
    }
  }
  
  // Parse "MM/DD" format
  if (eventDate.match(/^\d+\/\d+$/)) {
    const [monthStr, dayStr] = eventDate.split('/')
    const day = parseInt(dayStr)
    const paddedMonth = String(month).padStart(2, '0')
    return {
      sortKey: `${year}-${paddedMonth}-${String(day).padStart(2, '0')}`,
      eventStartDate: new Date(year, month - 1, day),
      eventEndDate: null
    }
  }
  
  // Default: use first day of month
  const paddedMonth = String(month).padStart(2, '0')
  return {
    sortKey: `${year}-${paddedMonth}-01`,
    eventStartDate: new Date(year, month - 1, 1),
    eventEndDate: null
  }
}

/**
 * Parse event date for Firestore storage
 */
export function parseEventDateToFirestore(eventDate, year, month) {
  const parsed = parseEventDate(eventDate, year, month)
  
  return {
    sortKey: parsed.sortKey,
    eventStartDate: parsed.eventStartDate ? admin.firestore.Timestamp.fromDate(parsed.eventStartDate) : null,
    eventEndDate: parsed.eventEndDate ? admin.firestore.Timestamp.fromDate(parsed.eventEndDate) : null
  }
}
```

**Usage in createEvent** (`composables/useApi.js`):
```javascript
import { parseEventDateToFirestore } from '~/composables/dateUtils.js'

async createEvent(eventData) {
  const { year, month, eventDate, ...rest } = eventData
  
  // Auto-generate sortKey and timestamps
  const parsed = parseEventDateToFirestore(eventDate, year, month)
  
  const processedData = {
    year,
    month,
    monthLabel: `${month}월`,  // Generate from month number
    eventDate,
    eventTitle: eventData.eventTitle,
    eventType: eventData.eventType,
    details: eventData.details,
    // Precomputed fields for efficient queries
    sortKey: parsed.sortKey,
    eventStartDate: parsed.eventStartDate,
    eventEndDate: parsed.eventEndDate,
    // Search optimization
    searchKeywords: generateSearchKeywords(eventData.eventTitle),
    searchableText: eventData.eventTitle.toLowerCase(),
    isRecurring: eventData.isRecurring || false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
  
  return await this.create('annual_events', processedData)
}
```

#### 3. App Check Enforcement Considerations

**⚠️ CRITICAL**: Gradual enforcement to avoid user friction.

**Phase 1: Monitor Mode (Week 1-2)**
```javascript
// Firebase Console: App Check → Enforcement → "Monitor only"
// Log failures but DON'T block requests
match /meal_signups/{signupId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null;  // No enforcement yet
}
```

**Phase 2: Soft Enforcement (Week 3-4)**
```javascript
// Block unknown platforms but allow known legitimate traffic
match /meal_signups/{signupId} {
  allow read: if request.auth != null 
    && (appCheckAttestation != null || isDevelopmentMode());
  allow write: if request.auth != null 
    && (appCheckAttestation != null || isDevelopmentMode());
}

function isDevelopmentMode() {
  return request.time < timestamp.date(2024, 12, 31);  // Temporary bypass
}
```

**Phase 3: Full Enforcement with Retry Logic (Week 5+)**
```javascript
// Frontend: Implement retry on App Check failures
async function safeApiCall(apiFunction, ...args) {
  let lastError = null
  const maxRetries = 3
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiFunction(...args)
    } catch (error) {
      lastError = error
      
      // Check if it's an App Check error
      if (error.code === 'app-check-failed' && attempt < maxRetries) {
        // Wait before retry (token might be refreshing)
        await sleep(1000 * attempt)
        continue
      }
      
      throw error
    }
  }
  
  throw lastError
}

// Usage
const result = await safeApiCall(apiService.signUpForMeal, mealId, userId, userName)
```

**Backend: Enable Full Enforcement**
1. Firebase Console → App Check → "Enforce App Check"
2. Enable for Firestore and Storage
3. Set "Enforcement Level" to "Block"
4. Monitor failure rates in dashboard

**Cloud Function: App Check Failure Monitoring**
```typescript
export const monitorAppCheckFailures = functions.firestore
  .document('{collection}/{document}')
  .onCreate(async (snap, context) => {
    // Log App Check token info
    const auth = context.auth
    const appCheckClaims = auth?.token?.app_check
    
    if (!appCheckClaims) {
      console.warn(`⚠️ Document created without App Check: ${context.params.collection}/${context.params.document}`)
      
      // Alert admin if too many failures
      await checkFailureRate()
    }
  })

async function checkFailureRate() {
  const recentFailures = await getRecentFailureCount()
  
  if (recentFailures > 50) {
    // Send alert to admin
    await sendAlert('High App Check failure rate detected')
  }
}
```

**User Communication Strategy**:
1. Pre-launch: Email users about new security update
2. Week of launch: In-app banner "Updating security for your protection"
3. During rollout: Show friendly error message if App Check fails
   ```javascript
   "Please refresh the page to continue. If this persists, contact support."
   ```
4. Monitor dashboard daily for first 2 weeks

**Handling False Positives**:
```javascript
// Whitelist known legitimate sources
function allowLegitimateAccess() {
  return request.auth != null 
    && (
      // Known admin IPs (if applicable)
      request.auth.token.ip_address in ['known.ip.range'] ||
      // Known device IDs (mobile)
      request.auth.token.firebase.identities.device_id in whitelistedDevices ||
      // Development token
      request.appCheckResult.debugToken != null
    )
}
```

---

## 9. Migration Strategy

**Phase 1**: Setup Firebase project and configure collections
**Phase 2**: Upload existing JSON data to Firestore
**Phase 3**: Implement authentication
**Phase 4**: Replace mock API calls with Firebase SDK calls
**Phase 5**: Upload audio and PDF files to Storage
**Phase 6**: Test end-to-end workflows
**Phase 7**: Deploy to production

**Existing Data Migration**:
- `public/data/songs.json` → `songs` collection
- `public/data/announcements.json` → `announcements` collection
- `announcements.json.annualPlan` → `annual_events` collection (flat document structure)
- Audio files in `public/data/` → Firebase Storage `/audio/`

**Important Note on annual_events**: The `annualPlan` array from announcements.json needs to be flattened into individual event documents. Each event becomes a separate document in the `annual_events` collection with proper year, month, and event details fields.

---

## 10. Testing Requirements

**Test Coverage**:
- [ ] Authentication flows (login, logout, registration)
- [ ] CRUD operations for all collections
- [ ] File upload/download functionality
- [ ] Real-time updates (live data sync)
- [ ] Security rules enforcement
- [ ] Role-based access control
- [ ] Pagination and query optimization
- [ ] Error handling and edge cases
- [ ] Mobile responsiveness
- [ ] Korean character support

**Critical Concurrency Tests**:
- [ ] **Meal signup race conditions** - Simulate 10+ simultaneous signups
- [ ] **Transaction retry behavior** - Verify conflicts are resolved correctly
- [ ] **Count accuracy** - Verify count field consistency under load
- [ ] **Capacity enforcement** - Test that full meals reject new signups
- [ ] **Duplicate prevention** - Verify users can't sign up twice
- [ ] **Cancel signup consistency** - Test concurrent cancel operations

**App Check Security Tests**:
- [ ] **App Check token generation** - Verify tokens are created on app launch
- [ ] **Token auto-refresh** - Test that tokens refresh before expiration
- [ ] **Debug mode behavior** - Verify debug tokens work in development
- [ ] **Production attestation** - Test reCAPTCHA Enterprise in staging
- [ ] **Unauthorized access blocked** - Verify requests without valid tokens are rejected
- [ ] **Mobile attestation** (if implemented) - Test Play Integrity / App Attest

---

## 11. Deliverables Checklist

- [ ] Firebase project created and configured
- [ ] All Firestore collections created with proper structure
- [ ] Security rules implemented and tested
- [ ] Firebase Storage configured with proper rules
- [ ] **Firebase App Check configured** (reCAPTCHA Enterprise setup)
- [ ] **App Check plugin implemented** for Nuxt 3
- [ ] **Debug tokens registered** for development environment
- [ ] Composite indexes created in Firestore
- [ ] **Search optimization fields implemented** (searchKeywords, titleNormalized, etc.)
- [ ] **Search preprocessing utility functions** (generateSearchKeywords, normalizeKorean)
- [ ] **Client-side search implemented** (MVP approach)
- [ ] Environment variables documented
- [ ] Migration script for existing JSON data
- [ ] Authentication flows implemented
- [ ] All CRUD operations functional
- [ ] File upload/download working
- [ ] **Transaction-based concurrent update implementation** (meal_signups)
- [ ] **Import statements documented** (runTransaction, arrayUnion, increment)
- [ ] Integration guide for frontend developer
- [ ] Production deployment guide

---

## 12. Additional Context

### Current Frontend File Structure
```
composables/
  useApi.js           ← Main API service (needs Firebase implementation)
  dateUtils.js
plugins/
  api.client.js        ← Client-side initialization
pages/
  choir/
    songs.vue         ← Song management page
    notices.vue        ← Announcements page
  auth/
    login.vue         ← Login page
types/
  index.js            ← Type definitions (SongTypes, VoiceParts, etc.)
```

### Sample Data References
See: `public/data/songs.json` and `public/data/announcements.json`

---

## Contact & Support

For clarification or questions during implementation, refer to:
- Project Structure: `PROJECT_STRUCTURE.md`
- Platform Rules: `KINGDOM_PLATFORM_RULES.md`
- Frontend codebase in `composables/useApi.js` for expected API interface

---

---

## 13. Search Implementation Quick Reference

**Summary**: Firestore doesn't support full-text search. Implement a 3-tier strategy for Korean text search.

### Tier 1: Client-Side Filtering (MVP - Immediate Implementation)
- **Best for**: < 1000 documents, simple substring matching
- **Data structure**: Add `searchKeywords` array and `titleNormalized` string to all documents
- **Implementation**: Fetch all, filter client-side using `Array.filter()`
- **Performance**: 50-100ms for <1000 items

### Tier 2: Firestore Array-Contains Queries (Hybrid)
- **Best for**: 1000-10,000 documents, single-keyword search
- **Data structure**: Preprocessed `searchKeywords` array per document
- **Implementation**: Use `where('searchKeywords', 'array-contains', keyword)`
- **Performance**: 100-300ms, server-side filtering
- **Limitation**: Requires multiple queries for multi-word search

### Tier 3: External Service (Algolia/Elasticsearch) 
- **Best for**: > 10,000 documents, complex search requirements
- **Cost**: ~$10-50/month
- **Implementation**: Sync Firestore → Algolia, query Algolia API
- **Performance**: < 50ms with relevance ranking
- **Features**: Typo tolerance, fuzzy matching, faceted search

**Recommended Implementation Order**:
1. ✅ Implement Tier 1 for MVP launch
2. Add search keyword preprocessing during document creation
3. Implement Tier 2 for better performance as data grows
4. Plan Tier 3 migration when approaching 1000+ documents or requiring advanced search

---

**END OF PROMPT**

