import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './MainPage.css';

interface Thread {
  id: number;
  title: string;
  created_at: string;
  user_id: number;
  view_count: number;
  post_count: number;
}


function MainPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [popularthreads, setPopularThreads] = useState<Thread[]>([]);
  const [latestThreads, setLatestThreads] = useState<Thread[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreads = async (sortBy: 'popular' | 'latest') => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/threads?sort_by=${sortBy}&per_page=5`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (sortBy === 'popular') {
          setPopularThreads(data.threads);
        } else {
          setLatestThreads(data.threads);
        }
      } catch (error) {
        console.error(`Failed to fetch ${sortBy} threads : `, error);
        setError('스레드 목록을 불러오는데 실패했습니다.');
      }
    };
    fetchThreads('popular');
    fetchThreads('latest');
  }, []); // []는 컴포넌트가 마운트될 때만 실행됨

  const handleNavigate = () => {
    navigate('/insert-thread');
  };

  return (
    <div className="main-board-background">
      <div className="writing-paper">
        <span className="paper-pin" aria-hidden="true">📌</span>
        <div className="main-container">
          {/* 왼쪽 사이드 */}
          <section className="thread-list-section">
            <h2>🔥{t('popular_threads')}</h2>
            <ul className="thread-list">
              {popularthreads.map(thread => (
                <li key={thread.id} className="thread-item">
                  <Link to={`/threads/${thread.id}`} className="thread-link thread-title">{thread.title}</Link>
                  <div className="thread-meta">
                    {t('views')}: {thread.view_count} | {t('posts')}: {thread.post_count}
                  </div>
                </li>
              ))}
            </ul>

            <h2>🔥{t('latest_threads')}</h2>
            <ul className="thread-list">
              {latestThreads.map(thread => (
                <li key={thread.id} className="thread-item">
                  <Link to={`/threads/${thread.id}`} className="thread-link thread-title">{thread.title}</Link>
                  <div className="thread-meta">
                    {new Date(thread.created_at).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
            {error && <p style={{ color: "red", textAlign: 'center' }}>{error}</p>}
          </section>

          {/* 오른쪽 사이드 */}
          <section className="announcement-section">
            <h1>{t('welcome')}</h1>
            <p>{t('information')}</p>
            <button onClick={handleNavigate}>{t('new_thread')}</button>
          </section>

        </div>
      </div>
    </div>
  );
}

export default MainPage;