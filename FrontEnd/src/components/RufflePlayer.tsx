import React, { useRef, useEffect } from 'react';

interface RufflePlayerProps {
    swfUrl : string;
}

const RufflePlayer: React.FC <RufflePlayerProps> = ({ swfUrl }) => {
    
    //Ruffle 컨테이너
    const containerRef = useRef <HTMLDivElement> (null);

    useEffect (() => {
        const ruffle = (window as any).RufflePlayer;

        if (ruffle && containerRef.current) {
            const player = ruffle.newest().createPlayer();
            containerRef.current.innerHTML= '';
            containerRef.current.appendChild(player);
            player.load(swfUrl);
        }
    }, [swfUrl]); // swfUrl 갱신될 때마다 플레이어 다시 불러오게끔
    return <div ref={containerRef} style={{ width: '800px', height: '600px'}} />;
};

export default RufflePlayer;