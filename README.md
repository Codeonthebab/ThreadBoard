# ThreadBoard

익명 게시판 프로젝트입니다. 사용자는 이메일 인증을 통해 가입하고, 스레드별로 부여되는 임시 익명 ID를 사용하여 자유롭게 토론에 참여할 수 있습니다.

---

## 🚀 Live Demo
- **Frontend (Vercel):** [https://thread-board.vercel.app](https://thread-board.vercel.app)  
- **Backend (Render):** [https://threadboard.onrender.com](https://threadboard.onrender.com)  

---

## 🛠 Tech Stack
- **Frontend:** React, TypeScript, React Router, i18next  
- **Backend:** Python, Flask, Flask-SQLAlchemy, PostgreSQL  
- **Deployment:** Vercel (Frontend), Render.com (Backend, DB)  
- **Key Libraries:** SendGrid (Email), Flask-Migrate (DB Schema Management), JWT (Authentication)  

---

## 📋 데이터베이스 스키마
Flask-Migrate를 통해 데이터베이스 버전이 관리되고 있습니다.

| Table        | Column          | Type     | Details                                   |
|--------------|----------------|----------|-------------------------------------------|
| **User**     | id             | Integer  | Primary Key                               |
|              | username       | String   | Unique, Not Null                          |
|              | password       | String   | Hashed, Not Null                          |
|              | email          | String   | Unique, Not Null                          |
|              | is_verified    | Boolean  | Default: False                            |
|              | location       | String   | Not Null                                  |
|              | created_at     | DateTime | Default: utcnow                           |
| **Thread**   | id             | Integer  | Primary Key                               |
|              | title          | String   | Not Null                                  |
|              | view_count     | Integer  | Default: 0                                |
|              | created_at     | DateTime | Default: utcnow                           |
|              | user_id        | Integer  | Foreign Key (user.id)                     |
| **Post**     | id             | Integer  | Primary Key                               |
|              | content        | Text     | Not Null                                  |
|              | depth          | Integer  | Default: 0                                |
|              | created_at     | DateTime | Default: utcnow                           |
|              | thread_id      | Integer  | Foreign Key (thread.id)                   |
|              | user_id        | Integer  | Foreign Key (user.id)                     |
|              | ip             | String   | Not Null                                  |
| **Notification** | id         | Integer  | Primary Key                               |
|              | recipient_id   | Integer  | Foreign Key (user.id)                     |
|              | sender_id      | Integer  | Foreign Key (user.id)                     |
|              | thread_id      | Integer  | Foreign Key (thread.id), Nullable         |
|              | post_id        | Integer  | Foreign Key (post.id), Nullable           |
|              | notification_type | String | Not Null (e.g., 'new_post')               |
|              | is_read        | Boolean  | Default: False                            |
|              | created_at     | DateTime | Default: utcnow                           |
| **AnonymousId** | id          | Integer  | Primary Key                               |
|              | user_id        | Integer  | Foreign Key (user.id)                     |
|              | thread_id      | Integer  | Foreign Key (thread.id)                   |
|              | anonymous_id   | String   | 8-digit random string                     |

---

## ✅ API 연동 체크리스트

### 🌍 전역 및 환경 설정 (Global & ENV)
- [x] API 기본 URL 설정: `.env` 파일을 통해 개발/배포 환경의 API 주소를 관리합니다.  
- [x] CORS 정책 확인: 백엔드(`__init__.py`)에 로컬 개발(localhost:3000) 및 배포 주소를 모두 허용합니다.  

**인증 컨텍스트 (AuthContext):**  
- [x] 로그인 성공 시, JWT 토큰이 localStorage에 `authToken` 키로 저장됩니다.  
- [x] 앱 로드 시, localStorage의 토큰을 읽어와 사용자 로그인 상태를 복원합니다.  
- [x] 로그아웃 시, localStorage에서 토큰이 정상적으로 제거됩니다.  

---

## 👤 사용자 인증 API (`/routes/auth.py`)

### 회원가입 (POST `/userProc`)
**[백엔드]:**
- [x] 필수 필드 누락 시 `400` 에러 반환  
- [x] username 또는 email 중복 시 `409` 에러 반환  
- [x] 비밀번호 해싱 후 DB 저장  
- [x] SendGrid를 통한 이메일 인증 링크 발송  

**[프론트엔드 - `RegisterPage.tsx`]:**
- [x] 모든 필드 JSON body 전송  
- [x] 성공(201) 시 "이메일을 확인해주세요" 메시지 표시  
- [x] 실패 시 적절한 에러 메시지 표시  

### 이메일 인증 (GET `/verify/:token`)
**[백엔드]:**
- [x] 유효하지 않거나 만료된 토큰 시 `400` 에러 반환  
- [x] 인증 성공 시 `user.is_verified = True`  

**[프론트엔드 - `VerifyPage.tsx`]:**
- [x] URL 파라미터 토큰으로 API 호출  
- [x] 성공/실패 메시지 및 로그인 링크 표시  

### 로그인 (POST `/login`)
**[백엔드]:**
- [x] 필수 필드 누락 시 `400` 에러  
- [x] 자격 증명 실패 시 `401` 에러  
- [x] 이메일 미인증 시 `403` 에러  
- [x] 로그인 성공 시 JWT 토큰 반환  

**[프론트엔드 - `LoginPage.tsx`]:**
- [x] 성공 시 토큰 저장 및 메인 페이지 이동  
- [x] 실패 시 에러 메시지 표시  

---

## 📋 스레드 & 게시물 API (`/routes/threads.py`)

### 스레드 생성 (POST `/threads`)
**[백엔드]:**
- [x] 인증된 사용자만 접근 (`@token_required`)  
- [x] Thread와 첫 Post 생성  

**[프론트엔드 - `insertThread.tsx`]:**
- [x] Authorization 헤더 포함  
- [x] 성공 시 상세 페이지로 이동  

### 스레드 목록 조회 (GET `/threads/popular`, `/threads/latest`)
**[백엔드]:**
- [x] 인기순, 최신순 정렬  
- [x] `page`, `per_page` 기반 페이징 정상 동작  

**[프론트엔드]:**
- [x] 올바른 API 호출  
- [x] 페이징 기능 정상 동작  
- [x] 리스트 렌더링 정상 동작  

### 특정 스레드 상세 조회 (GET `/threads/:thread_id`)
**[백엔드]:**
- [x] 존재하지 않는 ID 시 `404` 에러  
- [x] 조회 시 `view_count` 증가  
- [x] 익명 ID(author_id) 반환  

**[프론트엔드 - `ThreadInfoPage.tsx`]:**
- [x] API 호출 및 스레드 정보 표시  
- [x] 로딩/에러 처리  

### 스레드 삭제 (DELETE `/threads/:thread_id`)
**[백엔드]:**
- [x] 인증된 사용자만 접근  
- [x] 작성자가 아닐 경우 `403` 반환  
- [x] 삭제 성공 시 연관 Post 함께 삭제  

**[프론트엔드]:**
- [ ] 삭제 버튼 및 API 연동 구현 필요  
- [ ] UI 갱신 필요  

---

## 🔔 알림 API (`/routes/notifications.py`)

### 알림 생성 (댓글 작성 시)
**[백엔드]:**
- [x] 다른 사용자의 스레드에 댓글 작성 시 알림 생성  
- [x] 자기 자신의 스레드에는 알림 생성되지 않음  

### 알림 목록 조회 (GET `/notifications`)
**[백엔드]:**
- [x] 인증된 사용자만 자신의 알림 조회 가능  

**[프론트엔드 - `NotificationBell.tsx`]:**
- [x] 로그인 시 읽지 않은 알림 수 표시  
- [x] 아이콘 클릭 시 드롭다운으로 알림 목록 표시  

### 알림 읽음 처리 (POST `/notifications/:id/read`)
**[백엔드]:**
- [x] 인증된 사용자만 접근 가능  
- [x] 다른 사람 알림 접근 시 `403` 에러  
- [x] `is_read` 상태 True로 변경  

**[프론트엔드 - `NotificationBell.tsx`]:**
- [x] 알림 클릭 시 읽음 처리 및 해당 스레드로 이동  
- [x] UI 즉시 업데이트 (낙관적 업데이트)  

---
