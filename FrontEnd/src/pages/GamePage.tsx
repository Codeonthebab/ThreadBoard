import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import RufflePlayer from "../components/RufflePlayer";

interface Game {
  id: string;
  title: string;
  swfUrl: string;
  thumbnailUrl: string;
  type: "flash" | "phaser";
}

const games: Game[] = [
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
    title: "포Ke몬",
    swfUrl: "/games/trainercreator.swf",
    thumbnailUrl: "/thumbnails/pokemon.png",
    type: "flash",
  },
];

const GamePage: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const { t } = useTranslation();

  // 게임 플레이어 랜더링
  const renderGamePlayer = (game: Game) => {
    // 플래시 게임 선택 시
    if (game.type === "flash") {
      return <RufflePlayer swfUrl={game.swfUrl} />
    }

    // 나중에 Phaser로 만들 랜더링 로직 부분
    if (game.type === "phaser") {
      return <div>{t("Comming_soon_game")}</div>;
    }

    return null;
  };

  return (
    <div className="container mx-auto p-8">
      {/* 선택된 게임이 있는 경우 */}
      {selectedGame ? (
        <div>
          <button
            onClick={() => setSelectedGame(null)}
            className="mb-4 px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            &larr; {t("Back_to_GameSelected")}
          </button>
          <h2 className="text-3xl font-bold text-center mb-4">
            {selectedGame.title}
          </h2>
          <div className="flex justify-center">
            {renderGamePlayer(selectedGame)}
          </div>
        </div>
      ) : (
        /* 선택된 게임이 없는 경우 */
        <div>
          <h1 className="text-4xl font-bold text-center mb-2">
            {" "}
            {t("Mini_Game")}
          </h1>
          <p className="text-xl text-center text-gray-600 mb-8">
            {t("your_memory_game")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => setSelectedGame(game)}
              >
                <img
                  src={game.thumbnailUrl}
                  alt={game.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{game.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
