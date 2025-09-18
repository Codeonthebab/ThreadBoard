import React from 'react';
import { useTranslation } from 'react-i18next';
import './NoticePage.css'; 

function NoticePage () {
    const {t} = useTranslation();

    return (
        <div className="notice-board-background">
            {/* 공지사항 종이 부분 */}
            <div className="notice-paper">
                <h2>📌 {t('operator_notice')}</h2>
                <p>
                    {t('notice_content_1')}
                </p>
            </div>
            <div className="notice-paper">
                <h2>💡{t('how_to_use')}</h2>
                <p>t{('usage_guide1')}</p>
                <p>t{('usage_guide2')}</p>
                <p>t{('usage_guide3')}</p>
            </div>
        </div>
    );
}

export default NoticePage;