import React from 'react';
import ReactDOM from 'react-dom';

type ModalProps = {
    isOpen : boolean;
    onClose : () => void;
    children : React.ReactNode;
};

const Modal : React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <>
        {/* 모달 창 배경 */}
        <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        />

        {/* 모달 창 내용 */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
                {/* 닫기 버튼 */}
                <div className="flex justify-end p-2">
                    <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                    >
                        <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* 모달 내용 */}
                <div className="p-6 pt-0">
                    {children}
                </div>
            </div>
        </div>
        </>,
        document.body  // 모달을 body에 렌더링, Portal 사용
    );
};

export default Modal;