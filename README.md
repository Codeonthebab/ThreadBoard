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