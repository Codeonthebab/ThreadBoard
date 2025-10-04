import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { getColorByAuthorId } from "../utils/color";
import AddPostForm from "../components/AddPostForm";
import "./ThreadInfoPage.css";

interface ThreadData {
  id: number;
  title: string;
  created_at: string;
  user_id: number;
  author_id: string;
  view_count: number;
}

interface PostData {
  id: number;
  content: string;
  created_at: string;
  author_id: string; // user_id : number;
}

function ThreadInfoPage() {
  const { t } = useTranslation();
  const { thread_id } = useParams<{ thread_id: string }>(); // URL에서 Thread_id 가져옴
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [thread, setThread] = useState<ThreadData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const threadAuthorColor = useMemo(() => {
    if (!thread) return "";
    return getColorByAuthorId(thread.author_id);
  }, [thread]);

  const handleDelete = async () => {
    if (
      window.confirm(
        t("confirm_delete_thread") || "해당 스레드를 삭제하십니까?"
      )
    ) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/threads/${thread_id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          alert(t("delete_success") || "스레드가 삭제되었습니다.");
          navigate("/");
        } else {
          const data = await response.json();
          alert(
            t("delete_failed") || `삭제에 실패했습니다. 이유 : ${data.error}`
          );
        }
      } catch (err) {
        console.error("Failed to delete thread : ", err);
        alert(t("delete_error") || "삭제 중 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    const fetchThreadInfoPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/threads/${thread_id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setThread(data.thread);
        setPosts(data.posts);
      } catch (err) {
        console.error("Failed to fetch thread Info : ", err);
        setError("스레드 상세 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    if (thread_id) {
      fetchThreadInfoPage();
    }
  }, [thread_id]); // thread_id 변경되면 다시 데이터 가져옴

  const handlePostAdded = (newPost: PostData) => {
    setPosts((currentPosts) => [...currentPosts, newPost]);
  };

  if (loading) {
    return <div className="loading-message">{t("loading")}...</div>;
  }
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  if (!thread) {
    return <div className="error-message">{t("thread_not_found")}</div>;
  }

  return (
    <div className="thread-info-background">
      <div className="thread-info-container">
        <header className="thread-header">
          <h1>{thread.title}</h1>
          <div className="thread-meta">
            <span>
              {t("author")} : {thread.author_id}
            </span>{" "}
            |
            <span>
              {t("date")} : {new Date(thread.created_at).toLocaleString()}
            </span>{" "}
            |
            <span>
              {t("views")} : {thread.view_count}
            </span>
          </div>
          {user && thread && user.user_id === thread.user_id && (
            <button onClick={handleDelete} className="delete-button">
              {t("delete_thread") || "삭제"}
            </button>
          )}
        </header>
        <section className="posts-list">
          {posts.map((post, index) => {
            const postAuthorColor = getColorByAuthorId(post.author_id);

            return (
              <article key={post.id} className="post-item">
                <div className="post-header">
                  <strong>#{index + 1}</strong> 👤{t("Writer")} :
                  <span className="px-2 py-0.5 mx-1 fontsemibold text-gray-800 rounded-md"
                  style={{ backgroundColor : postAuthorColor }}> {post.author_id} </span>
                  | 📅{t("at")} {new Date(post.created_at).toLocaleString()}
                </div>
                <p className="post-content">{post.content}</p>
              </article>
            );
          })}
        </section>

        {token && thread && (
          <AddPostForm threadId={thread.id} onPostAdded={handlePostAdded} />
        )}
      </div>
    </div>
  );
}

export default ThreadInfoPage;
