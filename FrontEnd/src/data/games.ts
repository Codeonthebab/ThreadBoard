// 게임목록 소환!

export interface Game {
    id: string;
    title: string;
    swfUrl: string;
    thumbnailUrl: string;
    type: 'flash' | 'phaser';
}

export const games : Game [] = [
    {
        id: "bubble-puzzle",
        title: "버블 버블",
        swfUrl: "/games/puzzle.swf",
        thumbnailUrl: "/thumbnails/bubble.jpg",
        type: "flash",
    },
    {
        id: "tusukani",
        title: "투스카니 레이싱",
        swfUrl: "/games/tusukani_racing.swf",
        thumbnailUrl: "/thumbnails/tusukani.png",
        type: "flash",
    },
    {
        id: "gogunbuntu",
        title: "고군분투",
        swfUrl: "/games/gogunbuntuEN.swf",
        thumbnailUrl: "/thumbnails/gogunbuntu.png",
        type: "flash",
    },
    {
        id: "dadnme",
        title: "아빠와 나",
        swfUrl: "/games/dadnme.swf",
        thumbnailUrl: "/thumbnails/dadnme.jpg",
        type: "flash",
    },
    {
        id: "pokemon",
        title: "포KE몬",
        swfUrl: "/games/trainercreator.swf",
        thumbnailUrl: "/thumbnails/pokemon.png",
        type: "flash",
    },
    {
        id: "metalofwar1",
        title: "메탈오브워1 ⓒ 짱돌마왕",
        swfUrl: "/games/메탈오브워.swf",
        thumbnailUrl: "/thumbnails/메탈오브워.png",
        type: "flash",
    },
    {
        id: "metalofwar2",
        title: "메탈오브워2 ⓒ 짱돌마왕",
        swfUrl: "/games/메탈오브워2.swf",
        thumbnailUrl: "/thumbnails/메탈오브워2.png",
        type: "flash",
    },
    {
        id: "heroofswordsremake",
        title: "영웅의검리메이크 ⓒ 짱돌마왕",
        swfUrl: "/games/영웅의검리메이크.swf",
        thumbnailUrl: "/thumbnails/영웅의검리메이크.png",
        type: "flash",
    },
    {
        id: "cardchaser",
        title: "카드체이서 ⓒ 짱돌마왕",
        swfUrl: "/games/카드체이서.swf",
        thumbnailUrl: "/thumbnails/카드체이서.png",
        type: "flash",
    },
    {
        id: "wpnfire",
        title: "wpn_fire",
        swfUrl: "/games/wpnfire.swf",
        thumbnailUrl: "/thumbnails/wpnfire.png",
        type: "flash",
    },
];
