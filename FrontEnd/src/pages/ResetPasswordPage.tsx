import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ResetPasswordPage: React.FC = () => {
    const { t } = useTranslation();
    const { token } = useParams< { token: string } > ();
    const nav = useNavigate();

    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ error, setError ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError(t('Passwords_do_not_match') || '비밀번호가 일치하지 않습니다.');
            return;
        }
        
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-type' : 'application/json' },
                body: JSON.stringify( { password} ),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Sever Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    {t('new_password_set')}
                </h2>

                { message ? (
                    <div className="text-center">
                        <p className="text-green-600"> {message} </p>
                        <Link to = "/login" className="inline-block px-4 py-2 mt-4 font-semibold text-white
                        bg-indigo-600 rounded-md hover:bg-indigo-700">
                            {t('login_toppage')}
                        </Link>
                    </div>
                ): (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <p className="text-sm text-center text-red-500"> {error} </p>}
                        {/* 비밀번호 입력창 */}
                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                {t('new_password')}
                            </label>
                            <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 text-gray-800 border border-gray-300
                            rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-indigo-500"
                            />
                        </div>
                        {/* 비밀번호 확인 입력창 */}
                        <div>
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                {t('confirm_new_password')}
                            </label>
                            <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 text-gray-800 border border-gray-300
                            rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-indigo-500"
                            />
                        </div>
                        {/* 입력 버튼 */}
                        <div>
                            <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-2 font-semibold text-white bg-indigo-600
                            rounded-md shadow-sm hover:bg-indigo-700 disalbed:bg-indigo-400"
                            >
                                {loading ? t('submitting_register') : t('submitting_to_change_password')}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;