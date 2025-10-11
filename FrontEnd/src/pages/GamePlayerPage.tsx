// 게임을 진행하는 플레이어가 볼 화면
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { games } from '../data/games';
import { useTranslation } from "react-i18next";
import RufflePlayer from "../components/RufflePlayer";

const GamePlayerPage : React.FC = () => {
    const { gameId } = useParams <{ gameId : string }> ();
    const navigate = useNavigate();
    const game = games.find( g => g.id === gameId );
    const { t } = useTranslation();

    // 주소에 없는 게임 클릭하면 보여줄 것
    if (!game) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h2 className="text-2xl font-bold">
                    {t('None_game')}
                </h2>

                <button
                onClick={() => navigate('/games')}
                className="mt-4 px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                   &larr; {t('Back_to_GameSelected')}
                </button>
            </div>
        )
    }

    // 게임화면
    return (
    <div className="container mx-auto p-8">
        <button
        onClick={ () => navigate ('/games')}
        className="mb-4 px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
            &larr; {t('Back_to_GameSelected')}
        </button>

        <h2 className="text=3xl font-bold text-center mb-4">
            {game.title}
        </h2>

        <div className="flex justify-center">
            {game.type === 'flash' ? (
                <RufflePlayer swfUrl={game.swfUrl} />
            ) : (
                <div> {t('Comming_soon_game')} </div>
            )}
        </div>
    </div>
    );
};

export default GamePlayerPage;