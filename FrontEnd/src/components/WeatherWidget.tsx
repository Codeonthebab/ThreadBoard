import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import WeatherModal from "./weather/WeatherModal";

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    icon: string;
    description: string;
  }[];
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  // 모달 추가, 위치(위도/경도) 상태 유즈스테이트로 저장
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location, setlocation] = useState<{
    lat: number | null;
    lon: number | null;
  }>({ lat: null, lon: null });

  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

  // 위도, 경도 정보 패치 함수
  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    setlocation({ lat, lon });

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`
      );

      if (!response.ok) {
        throw new Error("날씨 정보를 가져오는데 실패했습니다.");
      }

      const data: WeatherData = await response.json();
      setWeather(data);
      setError(null);
    } catch (err) {
      setWeather(null);
      setError("날씨 정보를 가져오는데 실패했습니다.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 위치 정보 가져오기
  useEffect(() => {
    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      fetchWeather(latitude, longitude);
    };

    const handleError = (error: GeolocationPositionError) => {
      setError("위치 정보를 얻을 수 없습니다. 기본 위치의 날씨가 표시됩니다.");

      // 기본 위치 설정 : 서울
      fetchWeather(37.5665, 126.978);
    };

    // apiKey 누락 시 에러 처리되게끔
    if (!apiKey) {
      setError("날씨 API 키가 설정되지 않았습니다.");
      setLoading(false);
      return;
    }

    // 브라우저의 Geolocation API를 이용해서 유저 위치 정보 얻기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      setError("이 브라우저는 위치 정보를 지원하지 않습니다.");
      // Geolocation 지원 안할 시 기본 위치 : 서울
      fetchWeather(37.5665, 126.978);
    }
  }, [apiKey]); // apiKey 변경 시 재실행

  // 모달 제어 핸들러
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return <div className="text-white text-sm">{t("Weather_loading")}</div>;
  }

  if (error && !weather) {
    return <div className="text-yellow-400 text-sm"> {error} </div>;
  }

  if (!weather) {
    return null;
  }

  return (
    <>
      <div
        className="flex items-center space-x-2 text-white text-sm cursor-pointer hover:opacity-80"
        onClick={openModal}
      >
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
          alt={weather.weather[0].description}
          className="w-8 h-8"
        />
        <span>{weather.name}</span>
        <span>{Math.round(weather.main.temp)}°C</span>
      </div>

      {/* 모달 컴포넌트 랜더링 */}
      <WeatherModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialLat={location.lat}
        initialLon={location.lon}
      />
    </>
  );
};

export default WeatherWidget;
