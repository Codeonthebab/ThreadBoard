import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './LatestThreadsPage.css'; // 방금 만든 CSS 파일을 import

// 스레드 및 페이지 정보 타입을 정의
interface Thread {
  id: number;
  title: string;
  created_at: string;
  user_id: number;
  view_count: number;
  post_count: number;
}

interface PageInfo {
  page: number;
  per_page: number;
  pages: number;
  total: number;
}

function LatestThreadsPage() {
  const { t } = useTranslation();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestThreadsPage = async () => {
      setError(null);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/threads/latest?page=${currentPage}&per_page=5`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setThreads(data.threads);
        setPageInfo({
          page: data.page,
          per_page: data.per_page,
          pages: data.pages,
          total: data.total,
        });
      } catch (err) {
        console.error("Failed to fetch latest threads:", err);
        setError('최신 스레드 목록을 불러오는 데 실패했습니다.');
      }
    };

    fetchLatestThreadsPage();
  }, [currentPage]); // currentPage가 바뀔 때마다 API를 다시 호출

  return (
    <div className="thread-list-page-background">
      <div className="thread-list-container">
        <h1>🆕{t('latest_threads_list')}</h1>
        
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        <table className="thread-table">
          <thead>
            <tr>
              <th>{t('title')}</th>
              <th>{t('posts')}</th>
              <th>{t('views')}</th>
              <th>{t('date')}</th>
            </tr>
          </thead>
          <tbody>
            {threads.map(thread => (
              <tr key={thread.id}>
                <td><Link to={`/threads/${thread.id}`}>{thread.title}</Link></td>
                <td>{thread.post_count}</td>
                <td>{thread.view_count}</td>
                <td>{new Date(thread.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {pageInfo && (
          <div className="pagination-controls">
            <button 
              onClick={() => setCurrentPage(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              {t('previous')}
            </button>
            <span>Page {pageInfo.page} of {pageInfo.pages}</span>
            <button 
              onClick={() => setCurrentPage(currentPage + 1)} 
              disabled={currentPage === pageInfo.pages}
            >
              {t('next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LatestThreadsPage;