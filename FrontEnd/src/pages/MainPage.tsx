import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/insert-thread');
  };

  return (
    <>
      <h1>{t('welcome')}</h1>
      <p>{t('information')}</p>
      <p>
        <button onClick={handleNavigate}>{t('new_thread')}</button>
      </p>
    </>
  );
}

export default MainPage;