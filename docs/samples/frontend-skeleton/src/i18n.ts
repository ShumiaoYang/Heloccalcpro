import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'app.name': 'AI ToolBox',
      'nav.login': 'Login',
      'home.h1': 'Welcome to AI ToolBox',
      'tool.h1': 'AI Text Summarizer'
    }
  },
  zh: {
    translation: {
      'app.name': 'AI工具箱',
      'nav.login': '登录',
      'home.h1': '欢迎使用AI工具箱',
      'tool.h1': 'AI文本摘要工具'
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export function getLangFromPath(pathname: string): 'en' | 'zh' {
  return pathname.startsWith('/zh') ? 'zh' : 'en';
}

export function applyLanguageFromPath() {
  const lang = getLangFromPath(window.location.pathname);
  i18n.changeLanguage(lang);
}

export default i18n;