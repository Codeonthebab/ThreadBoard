import React, {useState, useEffect} from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from 'react-router-dom';

function VerifyPage() {
    
    const {t} = useTranslation();
    const { token } = useParams<{ token : string }> (); // URL 파라미터 값에서 토큰 겟
    const [verificationStatus, setVerificationStatus] = useState<string> ('인증을 확인하는 중입니다.');

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setVerificationStatus('유효하지 않은 토큰입니다.');
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/verify/${token}`);
                const data = await response.json();

                if (response.ok){
                    setVerificationStatus(data.message || '인증에 성공했습니다.');
                } else {
                    setVerificationStatus(data.Error || '인증에 실패했습니다. 다시 시도해주세요.');
                }
            } catch (error) {
                console.error("인증 요청 실패 : ", error);
                setVerificationStatus('서버와 통신 중 오류가 발생했습니다.');
            }
        };

        verifyToken();
    }, [token]); // []는 토큰 값이 변경될 때 '1'번 실행

    return (
        <div>
            <h3>{t('email_verify')}</h3>
            <p>{verificationStatus}</p>
            <Link to="/login">{t('loginTopage')}</Link>
        </div>
    );
}

export default VerifyPage;