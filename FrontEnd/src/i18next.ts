import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend) //public 폴더에서 번역 파일 불러오는 http Backend
    .use(LanguageDetector) // 유저 언어 감지하는 것
    .use(initReactI18next) //i18n 인스턴스를 전달하는 매게체
    .init({
        fallbackLng: 'ko', // 기본언어 설정이 감지가 안되면
        debug: true, // 개발 중에 활성화하는거, 디버그 메세지 콘솔에 출력하게끔
        interpolation: {
            escapeValue: false, // XSS 방어를 React에서 기본적으로 방어함, 그래서 false
        },
    });

export default i18n;