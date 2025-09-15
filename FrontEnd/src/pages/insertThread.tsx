import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import './insertThread.css';

interface CreateThreadResponse {
  message: string;
  thread_id: number;
}


function InsertThread() {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null> (null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('로그인이 필요한 작업입니다.');
      return;
    }

    try {
      const response = await fetch (`${process.env.REACT_APP_API_BASE_URL}/threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data: CreateThreadResponse = await response.json();

      if (response.ok) {
        navigate(`/threads/${data.thread_id}`);
        console.log(data);
      } else {
        setError((data as any).error || '스레드 생성 실패');
        console.log(data);
      }

    } catch (err) {
      setError('스레드 생성 중 오류가 발생했습니다.');
      console.error('스레드 생성 요청에 실패했습니다. 에러 내용 : ', err);
    }

  };

  return (
    <div className= "board-background">
      <div className="writing-paper">
      <h1>{t('new_thread')}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">{t('title')} : </label>
          <input 
          type="text" 
          id="title" 
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          />
        </div>

        <div>
          <label htmlFor="content">{t('content')}:</label>
          <textarea 
          id="content" 
          name="content"
          value={content}
          onChange={(e)=> setContent(e.target.value)}
          required
          />
        </div>

        {error && <p style={{ color: 'red'}}>{error}</p>}
        <button type="submit">{t('create_thread')}</button>

      </form>
      </div>
    </div>
  );
}

export default InsertThread;