import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
    
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/request-password-reset`, {
                method: 'POST',
                headers: { 'Content-type' : 'application/json' },
                body: JSON.stringify( { email } ),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || t('Check_your_email_for_password_reset_link'));
            } else {
                setError(data.error || t('Failed_to_request_password_reset'));
            }
        } catch (err) {
            setError('서버와 통신 중 문제가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    {t('forgot_password')}
                </h2>

                {/* 메세지 내용 있으면 메세지 보여주는거 */}
                { message ? (
                    <div className="text-center">
                        <p className="text-green-600"> {message} </p>
                        <Link to = "/login"
                        className="inline-block px-4 py-2 mt-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                            {t('login_toppage')}
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <p className="text-sm text-center text-gray-600">
                            {t('password_reset_guide')}
                        </p>

                        { error && <p className="text-sm text-center text-red-500">{error}</p> }

                        <div>
                            <label htmlFor="email"
                            className="text-sm font-medium text-gray-700">
                                {t('email')}
                            </label>
                            <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 text-gray-800 border border-gray-300
                            rounded-md shadow-sm focus:outline-none focus:ring-2
                            focus:ring-indigo-500"
                            placeholder="your_Email@email.com"
                            />
                        </div>

                        <div>
                            <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-2 font-semibold
                            text-white bg-indigo-600
                            rounded-md shadow-sm
                            hover:bg-indigo-700 disabled:bg-indigo-400"
                            >
                                {loading ? t('submitting_Email') : t('submit_reset_link')}
                            </button>
                        </div>

                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;