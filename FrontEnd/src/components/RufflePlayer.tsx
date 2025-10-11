import React, { useRef, useEffect } from 'react';

interface RufflePlayerProps {
    swfUrl : string;
}

const RufflePlayer: React.FC <RufflePlayerProps> = ({ swfUrl }) => {
    
    //Ruffle 컨테이너
    const containerRef = useRef <HTMLDivElement> (null);

    useEffect (() => {
        // 플레이어 인스턴스 저장할 변수
        let player : any = null;
        const ruffle = (window as any).RufflePlayer;

        if (ruffle && containerRef.current) {
            player = ruffle.newest().createPlayer();
            const container = containerRef.current;

            container.innerHTML= '';
            container.appendChild(player);
            player.load(swfUrl);
        }

        return () => {
            // 컴포넌트 없어지면 뒷정리하게끔 (clean-up)
            if (player) {
                player.remove();
            }
        };
    }, [swfUrl]); // swfUrl 갱신될 때마다 플레이어 다시 불러오게끔
    return <div ref={containerRef} style={{ width: '800px', height: '600px'}} />;
};

export default RufflePlayer;