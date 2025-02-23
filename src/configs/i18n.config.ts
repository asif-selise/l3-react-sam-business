import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const availableLocales = ["en", "de", "fr", "it", "es", "pt", "sq", "tr", "sl"];
const defaultLocale = "de";


const userLanguage = cookies.get('systemLanguage');
const detectedLanguage = availableLocales.includes(userLanguage) ? userLanguage : defaultLocale;

i18n
    .use(initReactI18next)
    .use(HttpApi)
    .init({
        returnNull: false,
        fallbackLng: defaultLocale,
        supportedLngs: availableLocales,
        ns: ['index'],
        lng: detectedLanguage,
        returnEmptyString: false,
        backend: {
            loadPath: '/i18n/{{ns}}/{{lng}}.json',
        },
        interpolation: { escapeValue: false },
        parseMissingKeyHandler: (key) => `Missing translation: ${key}`,
    });

export default i18n;
export type Locale = (typeof availableLocales)[number];
