import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import { useTranslation } from 'react-i18next';
import { init } from 'i18next';

// OpenWeatherMap API 응답 구조 정의
// 날씨 정보 응답 구조
interface WeatherGeoResponse {
    name: string;
    lat: number;
    lon: number;
    country: string;
}

// 5일간 3시간 단위 예보 응답 구조 - 날씨 예보 응답 구조
interface WeatherForecastItem {
    dt : number;
    dt_txt : string;
    main : {
        temp : number;
        temp_min : number;
        temp_max : number;
    };
    weather : [
        {
            description : string;
            icon : string;
        }
    ];
}
interface WeatherForecastResponse {
    list : WeatherForecastItem[];
    city : {
        name : string;
    };
}

// 일별 예보 데이터 타입
interface DailyForecast {
    date: string;
    dayOfWeek : string;
    temp_min: number;
    temp_max: number;
    icon : string;
    description : string;
}

// 모달 내 컴포넌트 Props 타입
type WeatherModalProps = {
    isOpen : boolean;
    onClose : () => void;
    initialLat : number | null;
    initialLon : number | null;
};

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

// 3시간 간격 예보(40개) 데이터를 받아서 5일치 일별 요약으로 가공하는 함수 생성
const processForecastData = ( list : WeatherForecastItem[]) : DailyForecastly[] => {
    const dailyData : { [key: string] : DailyForecast } = {};
    const { i18n } = useTranslation();

    list.forEach( (item) => {
        const data = item.dt_txt.split(' ')[0]; // 'YYYY-MM-DD' 부분 추출

        if ( !dailyData[data] ) {
            const dateObj = new Date(item.dt * 1000);
            dailyData[date] = {
                date: date,
                // 한글, 영어 로케일에 맞춰서 요일 포맷팅 처리
                dayOfWeek : dateObj.toLocaleDateString( i18nß.language || 'ko-KR', { weekday: 'short' }),
                temp_min: item.main.temp_min,
                temp_max: item.main.temp_max,
                // 12시를 기준으로 아이콘 사용, 설명 설정
                icon : item.dt_txt.includes('12:00:00') ? item.weather[0].icon : list[0].weather[0].icon,
                description : item.weather[0].description,
            };
        } else {
            // 최저 / 최고 기온 업데이트
            if ( item.main.temp_min < dailyData[date].temp_min ) {
                dailyData[date].temp_min = item.main.temp_min;
            }
            if ( item.main.temp_max > dailyData[date].temp_max ) {
                dailyData[date].temp_max = item.main.temp_max;
            }
            // 12시 (낮) 아이콘으로 덮어씀
            if ( item.dt_txt.includes('12:00:00') ) {
                dailyData[date].icon = item.weather[0].icon;
                dailyData[date].description = item.weather[0].description;
            }
        }
    });
    // 날짜 데이터가 3시간 예보에만 걸쳐져있을 수 있다. 
    // 객체를 배열로 변환 후 처음 5일치 데이터 반환
    return Object.values(dailyData).slice(0, 5);
};

const WeatherModal : React.FC<WeatherModalProps> = ({
    isOpen,
    onClose,
    initialLat,
    initialLon,
}) => {
    const { t, i18n } = useTranslation();
    const [ query, setQuery ] = useState('');
    const [ forecast, setForecast ] = useState<DailyForecast[] | null> (null);
    const [ cityName, setCityName ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState('');

    // 위도, 경도 기준 5일 분량 예보 
    const fetchForecast = async ( lat: number, lon: number ) => {
        if (!API_KEY) {
            setError('OpenWeatherMap API 키가 설정되지 않았습니다.');
            return;
        }
        setLoading(true);
        setError('');
        setForecast(null);

        const lang = i18n.language === 'ko' ? 'kr' : 'en';
        const units = 'metric';
        const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}&lang=${lang}`;

        try {
            const response = await fetch(URL);
            if (!response.ok) throw new Error(t('weather_fetch_error')|| '날씨 정보를 불러오는데 실패했습니다.s');
            
            const data : WeatherForecastResponse = await response.json();
            setCityName(data.city.name);
            setForecast(processForecastData(data.list));
        } catch (err : any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    // 도시명으로 위도, 경도 검색 후 예보 가져오기
    const handleSearch = async (e : React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        setLoading(true);
        setError('');

        const URL = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY}`;

        try {
            const response = await fetch(URL);
            if (!response.ok) throw new Error(t('city_search_error') || '도시 정보를 불러오는데 실패했습니다.');

            const data : WeatherGeoResponse[] = await response.json();
            if( data.length === 0 ) {
                throw new Error(t('city_not_found') || '해당 도시를 찾을 수 없습니다.');
            }
            
            const { lat, lon } = data[0];
            fetchForecast(lat, lon); //  검색 성공하면 예보 가져오기
        } catch (err : any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 모달 열릴 때(isOpen=true) 초기 위도, 경도 기준 예보 가져오기
    useEffect( () => {
        if ( isOpen && initialLat && initialLon ) {
            fetchForecast (initialLat, initialLon);
        }
    }, [isOpen, initialLat, initialLon] );

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            {/* 타이틀 */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t('weather_forecast')}
            </h3>

            {/* 다른 도시 검색할 수 있게끔 도시 검색 폼*/}
            <form onSubmit={handleSearch} className="flex mb-4">
                <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search_city_placeholder')||'도시 이름 검색 (Ex : Tokyo)'}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-r-md hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                    {loading ? t('searching_city') : t('search_city')}
                </button>


            </form>
        </Modal>
    )

}