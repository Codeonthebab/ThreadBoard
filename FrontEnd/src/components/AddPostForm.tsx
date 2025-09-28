import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import './AddPostForm.css'

interface AddPostFormProps {
    threadId : number;
    onPostAdded : (newPost : any) => void; // 부모에게 포스트 전달할 콜백 함수 부분
}

function AddPostForm ({ threadId, onPostAdded } : AddPostFormProps ) {
    const { t } = useTranslation ();
    const { token } = useAuth();
    const [ content, setContent ] = useState('');
    const [ error, setError ] = useState<string | null> (null);
    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const handleSubmit = async (event : React.FormEvent) => {
        event.preventDefault();

        if (!content.trim()) {
            setError('내용을 입력해야합니다.')
            return;
        }
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/threads/${threadId}/posts`, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`,
                },
                body : JSON.stringify({ content }),
            });

            const data = await response.json();
            
            if (response.ok) {
                onPostAdded(data.post);
                setContent('');
            } else {
                setError('해당 스레드에 대한 스레드 작성에 실패했습니다.');
                console.log(data.error);
            }
        } catch (err) {
            console.error("Failed to add post : ", err);
            setError('서버와 통신 중 오류가 발생했습니다.')
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className = "add-post-form" onSubmit={handleSubmit}>
            <h3>{t('add_comment')}</h3>
           
            <textarea
            value = {content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('enter_comment_placeholder')|| '이곳에 댓글을 입력하세요!'}
            rows={4}
            required/>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('submitting') : t('submit_comment')}
            </button>
        </form>
    );
}

export default AddPostForm;
