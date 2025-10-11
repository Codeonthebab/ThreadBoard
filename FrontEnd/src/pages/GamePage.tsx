import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { games } from '../data/games';

const GamePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-2">{t("Mini_Game")}</h1>
      <p className="text-xl text-center text-gray-600 mb-8">
        {t("your_memory_game")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate(`/games/${game.id}`)}
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
  );
};

export default GamePage;
