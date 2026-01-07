# Kingdom Platform 개발 규칙

이 문서는 Kingdom Platform에서 앱 개발 시 준수해야 하는 공통 규칙들을 정리한 것입니다.

## 📌 Cursor IDE 전달용 규칙

### 1. 기본 정보 제출 (STEP 1)

* **App Name**: 사용자에게 표시되는 이름
* **App ID**: Firebase / Git Repository 등록에 사용
* **App 설명**: 사용자 노출 설명
* **개발자 목록**: Gmail 계정 필수 (소유자 / 편집자 / 뷰어 권한 포함)

### 2. Project 생성 및 초대 (STEP 2)

* **개발 환경**: `{app id}-dev`
* **운영 환경**: `{app id}`
* **Firebase 권장 서비스**: Authentication, Firestore Database, Functions, Hosting, Storage
* **초대 진행**: 제출된 Gmail 계정으로 초대 진행

### 3. 소스형상관리 (STEP 3)

* **조직**: `kingdompla-net` (고정)
* **Team**: `{app id}` (개발자 초대)
* **Repository**: `{app id}-be`, `{app id}-fe`
* **Front-end / Back-end Repository 각각 생성**
* **접근 권한**: 해당 Team 개발자만 가짐

### 4. Back-end 개발 규칙

* **기본 소스 프로젝트 제공**: `git clone`
* **CodeBase 구조**:

  ```
  codebase (system)
   ├─ common
   ├─ config
   ├─ database (firestore access)
   ├─ function (logic 구현)
   ├─ test
   └─ 기타
  ```
* **Firestore collection 구성** → function 규칙에 맞게 선언 후 구현

### 5. Front-end 개발 규칙

* **기본 소스 프로젝트 제공**: `git clone`
* **구조**:

  ```
  APP_FE
   └─ src
      └─ page
         └─ menu
            └─ screen.vue
  ```
* **page 아래 메뉴별 vue 파일 구현**
* **Back-end function 호출 시 `callAPI` 표준 준수**

### 6. KP API 호출 규칙

* **KP APP 등록 후 Key 발급**:
  * `client_id`
  * `client_secret`
  * `admin_api_secret`
* **Sample 코드 표준에 맞춰 axios 기반 REST API 호출**

### 7. 배포 규칙

#### **Back-end**
* **Dev**: `npm run deploy`
* **Prod**: `npm run deploy:prd`
* **확인**: Firebase Functions에서 확인

#### **Front-end**
* **Dev**: `npm run deploy`
* **Prod**: `npm run deploy:prd`
* **확인**: Firebase Hosting에서 확인

## 🔧 개발 환경 설정

### Firebase 프로젝트 구조
```
{app-id}-dev (개발환경)
├── Authentication
├── Firestore Database
├── Functions
├── Hosting
└── Storage

{app-id} (운영환경)
├── Authentication
├── Firestore Database
├── Functions
├── Hosting
└── Storage
```

### Git Repository 구조
```
kingdompla-net/{app-id}-fe (Frontend)
├── src/
│   └── page/
│       └── menu/
│           └── screen.vue
└── package.json

kingdompla-net/{app-id}-be (Backend)
├── common/
├── config/
├── database/
├── function/
├── test/
└── package.json
```

## 📋 API 호출 표준

### Frontend에서 Backend 호출
```javascript
// 표준 callAPI 사용
import { callAPI } from '@/utils/api'

const result = await callAPI('functionName', {
  // parameters
})
```

### KP API 호출
```javascript
// axios 기반 REST API 호출
import axios from 'axios'

const response = await axios.post('https://api.kingdompla.net/endpoint', {
  client_id: process.env.VITE_CLIENT_ID,
  client_secret: process.env.VITE_CLIENT_SECRET,
  // other parameters
})
```

## 🚀 배포 프로세스

### 개발 환경 배포
```bash
# Backend
npm run deploy

# Frontend  
npm run deploy
```

### 운영 환경 배포
```bash
# Backend
npm run deploy:prd

# Frontend
npm run deploy:prd
```

## ⚠️ 주의사항

1. **환경 변수**: 각 환경별로 적절한 환경 변수 설정 필수
2. **권한 관리**: Firebase 프로젝트 권한은 필요한 최소 권한만 부여
3. **코드 표준**: 제공된 기본 소스 프로젝트 구조 준수
4. **API 호출**: 표준화된 방식으로만 API 호출
5. **배포 확인**: 배포 후 Firebase 콘솔에서 정상 동작 확인

## 📞 지원

Kingdom Platform 개발 관련 문의사항이 있을 경우 해당 규칙을 먼저 확인하고, 필요시 개발팀에 문의하시기 바랍니다.
