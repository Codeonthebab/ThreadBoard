// 화면 하단에 넣을 것
import React from "react";

const Footer : React.FC = () => {
    
    const currentYear = new Date().getFullYear();

    return (
        // 하단 컨테이너
        <footer className="bg-gray-800 text-gray-400 py-4">
            <div className="container mx-auto px-6 flex justify-between 
            items-center text-sm">
                <span>
                    © {currentYear} [Engine Ko]. All Rights Reserved.
                </span>

                <a 
                href="mailto : [engineko515@gmail.com]"
                className="hover:text-white transition-colors"
                >
                    Context Us
                </a>
                
            </div>
        </footer>
    );
};

export default Footer;