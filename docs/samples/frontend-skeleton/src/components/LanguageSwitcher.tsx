import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import i18n from '../i18n';

function rebasePath(path: string, lang: 'en' | 'zh') {
  if (lang === 'zh') {
    return path.startsWith('/zh') ? path : ('/zh' + (path === '/' ? '/' : path));
  } else {
    return path.startsWith('/zh') ? (path.replace(/^\/zh/, '') || '/') : path;
  }
}

export default function LanguageSwitcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentIsZh = location.pathname.startsWith('/zh');

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as 'en' | 'zh';
    localStorage.setItem('preferredLanguage', lang);
    i18n.changeLanguage(lang);
    const next = rebasePath(location.pathname, lang);
    navigate(next, { replace: true });
  };

  return (
    <select value={currentIsZh ? 'zh' : 'en'} onChange={onChange} aria-label="language-switcher">
      <option value="en">EN</option>
      <option value="zh">中文</option>
    </select>
  );
}