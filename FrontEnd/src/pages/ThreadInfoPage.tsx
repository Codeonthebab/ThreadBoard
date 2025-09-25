import React, { useEffect, useState, useTransition } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import './ThreadInfoPage.css';

interface  ThreadData {
    id : number;
    title : string;
    created_at : string;
    user_id : number;
    view_count : number;
}

interface PostData {
    id : number;
    content : string;
    created_at : string;
    user_id : number;
}

function ThreadInfoPage () {
    const { t } = useTranslation();
    const { thread_id } = useParams<{thread_id:string}> (); // URL에서 Thread_id 가져옴

    const [thread, setThread] = useState<ThreadData | null> (null)
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    useEffect (() => {
        const fetchThreadInfoPage = async () => {
            try {
                setLoading (true);
                setError(null);
                const response = await fetch (`${process.env.REACT_APP_API_BASE_URL}/threads/${thread_id}`);
                
                if (!response.ok) {
                    throw new Error (`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setThread(data.thread);
                setPosts(data.posts);
            } catch (err) {
                console.error("Failed to fetch thread Info : ", err);
                setError('스레드 상세 정보를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        if (thread_id) {
            fetchThreadInfoPage();
        }
    }, [thread_id]); // thread_id 변경되면 다시 데이터 가져옴

    if (loading) {
        return <div className="loading-message">{t('loading')}...</div>;
    }
    if (error) {
        return <div className="error-message">{error}</div>;
    }
    if (!thread) {
        return <div className="error-message">{t('thread_not_found')}</div>;
    }

    return (
        <div className="thread-detail-background">
            <div className="thread-detail-container">
                <header className="thread-header">
                    <h1>{thread.title}</h1>
                    <div className="thread-meta">
                        <span>{t('author')} : ${thread.user_id}</span> |
                        <span>{t('date')} : {new Date(thread.created_at).toLocaleString()}</span> |
                        <span>{t('views')} : {thread.view_count}</span>
                    </div>
                </header>
                <section className="posts-list">
                    {posts.map((post, index) => (
                        <article key={post.id} className="post-item">
                            <div className="post-header">
                                <strong>#{index+1}</strong> by User {post.user_id} at {new Date(post.created_at).toLocaleString()}
                            </div>
                            <p className="post-content">{post.content}</p>
                        </article>
                    ))}
                </section>
            </div>
        </div>
    );
}

export default ThreadInfoPage;