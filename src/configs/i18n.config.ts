import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

i18n
    .use(initReactI18next)
    .use(HttpApi)
    .init({
        returnNull: false,
        fallbackLng: 'en',
        ns: ['index'],
        lng: cookies.get('systemLanguage'),
        returnEmptyString: false,
        backend: {
            loadPath: '/i18n/{{ns}}/{{lng}}.json',
        },
        interpolation: { escapeValue: false },
    });

export default i18n;
