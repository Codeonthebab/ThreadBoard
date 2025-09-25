# ThreadBoard

##Table
- User, Thread, Post

[User]
- id, username, password, email, created_at

[Thread]
- id, title, created_at, user_id

[Post]
- id, content, depth, created_at, thread_id,
    user_id, ip


[✅ ThreadBoard 프로젝트: API 연동 체크리스트]
### 🌍 전역 및 환경 설정 (Global & ENV)

[x] API 기본 URL 설정: 프론트엔드 코드 전반에 걸쳐 process.env.REACT_APP_API_BASE_URL을 사용하여 API 주소를 환경에 따라 관리하고 있습니다.

[x] CORS 정책 확인: 백엔드(__init__.py)에 로컬 개발 주소(http://localhost:3000)와 배포 주소(https://thread-board.vercel.app)가 모두 올바르게 포함되어 있습니다.

##### 인증 컨텍스트 (AuthContext):
[x] 로그인 성공 시, JWT 토큰이 localStorage에 authToken이라는 키로 저장됩니다.

[x] 앱 로드 시, localStorage의 토큰을 읽어와 사용자 로그인 상태를 복원합니다.

[x] 로그아웃 시, localStorage에서 토큰이 정상적으로 제거됩니다.

### 👤 사용자 인증 API (/auth.py)

#### 회원가입 (POST /userProc)

##### [백엔드]:
[x] 필수 필드 누락 시 400 에러를 반환합니다.

[x] username 또는 email 중복 시 409 에러를 반환합니다.

[x] 비밀번호가 정상적으로 해싱되어 DB에 저장됩니다.

[x] SendGrid를 통한 이메일 인증 링크가 정상적으로 발송됩니다.

##### [프론트엔드 - RegisterPage.tsx]:
[x] Content-Type: application/json 헤더가 포함되어 있습니다.

[x] 모든 필드 값을 JSON 형태로 body에 담아 보냅니다.

[x] 회원가입 성공(201) 시, 안내 메시지가 표시됩니다.

[x] 실패 시, 사용자에게 적절한 에러 메시지를 보여줍니다.

#### 이메일 인증 (GET /verify/:token)

##### [백엔드]:
[x] 유효하지 않은 토큰에 대해 400 에러를 반환합니다.

[x] 토큰에 해당하는 사용자가 없을 때 404 에러를 반환합니다.

[x] 성공적으로 인증되면 user.is_verified가 True로 변경됩니다.


##### [프론트엔드 - VerifyPage.tsx]:
[x] URL 파라미터에서 토큰을 가져와 API를 호출합니다.

[x] 인증 상태에 따라 "인증 중", "성공", "실패" 메시지를 보여줍니다.

[x] 인증 완료 후 로그인 페이지로 이동할 수 있는 링크를 제공합니다.

#### 로그인 (POST /login)

##### [백엔드]:
[x] username 또는 password 누락 시 400 에러를 반환합니다.

[x] 자격 증명 실패 시 401 에러를 반환합니다.

[x] 이메일 미인증 사용자에 대해 403 에러를 반환합니다.

[x] 로그인 성공 시, JWT 토큰을 정상적으로 반환합니다.

##### [프론트엔드 - LoginPage.tsx]:
[x] Content-Type: application/json 헤더가 포함되어 있습니다.

[x] username, password 값을 JSON 형태로 body에 담아 보냅니다.

[x] 로그인 성공 시, 토큰을 저장하고 메인 페이지로 이동합니다.

[x] 로그인 실패 시, 에러 메시지를 화면에 표시합니다.

### 📋 스레드 & 게시물 API (/threads.py)

#### 스레드 생성 (POST /threads)

##### [백엔드]:
[x] 토큰 없이는 접근이 차단됩니다 (@token_required).

[x] title이 없으면 400 에러를 반환합니다.

[x] Thread와 첫 Post가 현재 로그인된 사용자의 ID로 정상적으로 생성됩니다.

##### [프론트엔드 - insertThread.tsx]:
[x] Authorization: Bearer ${token} 헤더가 올바르게 포함됩니다.

[x] title, content 값을 JSON 형태로 body에 담아 보냅니다.

[x] 스레드 생성 성공 시, 생성된 스레드의 상세 페이지로 이동합니다.

[x] 로그인하지 않은 상태에서 시도할 경우 적절한 메시지를 보여줍니다.

#### 스레드 목록 조회 (GET /threads/popular, /threads/latest)

##### [백엔드]:
[x] GET /threads/popular API가 인기순(댓글 수, 조회수)으로 정렬됩니다.

[x] GET /threads/latest API가 최신순으로 정렬됩니다.

[x] page, per_page 파라미터를 이용한 페이징이 정상 동작합니다.

##### [프론트엔드 - PopularThreadsPage.tsx, LatestThreadsPage.tsx]:
[x] 각 페이지가 목적에 맞는 API(.../popular, .../latest)를 호출합니다.

[x] 페이징(다음/이전 버튼) 기능이 currentPage state를 변경하며 API를 다시 호출합니다.

[x] API로부터 받은 스레드 목록을 화면에 올바르게 렌더링합니다.

[x] 데이터 로딩 실패 시, 에러 메시지를 사용자에게 보여줍니다.

#### 특정 스레드 상세 조회 (GET /threads/:thread_id)
##### [백엔드]:
[x] 존재하지 않는 thread_id에 대해 404 에러를 반환합니다.

[x] API 호출 시, 해당 스레드의 view_count가 1 증가합니다.

[x] 스레드 정보와 해당 스레드에 속한 모든 Post 목록을 함께 반환합니다.

[프론트엔드 - (상세 페이지 구현 시)]:
[ ] URL의 :thread_id를 이용해 올바른 API를 호출하나요?

[ ] 스레드 제목, 내용, 그리고 이후 댓글들을 모두 화면에 표시하나요?

[ ] 로딩 및 에러 상태를 적절히 처리하나요?

#### 스레드 삭제 (DELETE /threads/:thread_id)
##### [백엔드]:
[x] 토큰 없이는 접근이 차단됩니다.

[x] 스레드 작성자가 아닌 다른 사용자가 삭제 시도 시 403 에러를 반환합니다.

[x] 존재하지 않는 thread_id에 대해 404 에러를 반환합니다.

[x] 삭제 성공 시, 연관된 모든 Post가 함께 삭제됩니다.

##### [프론트엔드 - (삭제 기능 구현 시)]:
[ ] fetch 요청 시 Authorization 헤더가 올바르게 포함되나요?

[ ] 삭제 성공 후, UI를 적절히 갱신하나요?

[ ] 권한이 없거나 실패했을 때 사용자에게 알림을 주나요?
