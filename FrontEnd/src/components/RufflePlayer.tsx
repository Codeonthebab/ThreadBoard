import React, { useRef, useEffect } from 'react';

declare global {
    interface Window {
        RufflePlayer: any;
    }
}

interface RufflePlayerProps {
    swfUrl : string;
}

const RufflePlayer: React.FC <RufflePlayerProps> = ({ swfUrl }) => {
    
    //Ruffle 컨테이너
    const containerRef = useRef <HTMLDivElement> (null);
    const playerRef = useRef <any> (null);

    useEffect (() => {

        if (window.RufflePlayer && containerRef.current) {
            const ruffle = window.RufflePlayer.newest();
            const player = ruffle.createPlayer();

            // player 인스턴스 ref에 저장
            playerRef.current = player;

            const container = containerRef.current;
            container.innerHTML= '';
            container.appendChild(player);
            player.load(swfUrl);
        }
        // 컴포넌트 없어지면 뒷정리하게끔 (clean-up)
        return () => {
            
            if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                playerRef.current.destroy();
                playerRef.current=null;
            }
        };
    }, [swfUrl]); // swfUrl 갱신될 때마다 플레이어 다시 불러오게끔
    return <div ref={containerRef} style={{ width: '800px', height: '600px'}} />;
};

export default RufflePlayer;