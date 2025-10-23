import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import i18n, { applyLanguageFromPath, getLangFromPath } from './i18n';
import { loadSEOConfig, resolveSEO, buildAlternates } from './seo';
import LanguageSwitcher from './components/LanguageSwitcher';
import Home from './pages/Home';
import ToolsTextSummarizer from './pages/ToolsTextSummarizer';

function HeadTags({ seo, origin, pathname }: { seo: any; origin: string; pathname: string }) {
  const alternates = buildAlternates(origin, pathname);
  const pageTitle = seo.title || 'AI ToolBox';
  return (
    <Helmet>
      <title>{pageTitle}</title>
      {seo.description && <meta name="description" content={seo.description} />}
      {seo.keywords && <meta name="keywords" content={seo.keywords} />}
      <link rel="canonical" href={`${origin}${pathname}`} />
      <link rel="alternate" hrefLang="en" href={alternates.en} />
      <link rel="alternate" hrefLang="zh" href={alternates.zh} />
    </Helmet>
  );
}

function Layout({ config }: { config: any }) {
  const location = useLocation();
  const navigate = useNavigate();
  const origin = (typeof window !== 'undefined' && window.location.origin) || 'https://site.com';
  const [seo, setSeo] = useState<any>({});

  useEffect(() => {
    const preferred = localStorage.getItem('preferredLanguage');
    const currentLang = getLangFromPath(location.pathname);
    if (!preferred) {
      const isZhBrowser = (navigator.language || '').toLowerCase().startsWith('zh');
      const isEnPath = !location.pathname.startsWith('/zh');
      if (isZhBrowser && isEnPath) {
        navigate('/zh' + (location.pathname === '/' ? '/' : location.pathname), { replace: true });
        return;
      }
    }
    i18n.changeLanguage(currentLang);
  }, [location.pathname, navigate]);

  useEffect(() => {
    const lang = getLangFromPath(location.pathname);
    const resolved = resolveSEO(config, location.pathname, lang);
    setSeo(resolved);
  }, [config, location.pathname]);

  return (
    <div>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid #eee' }}>
        <div>{i18n.t('app.name')}</div>
        <div>
          <LanguageSwitcher />
          <button style={{ marginLeft: 12 }}>{i18n.t('nav.login')}</button>
        </div>
      </nav>
      <HeadTags seo={seo} origin={origin} pathname={location.pathname} />
      <main style={{ padding: '16px' }}>
        <Routes>
          <Route path="/" element={<Home seo={seo} />} />
          <Route path="/zh" element={<Home seo={seo} />} />
          <Route path="/tools/text-summarizer" element={<ToolsTextSummarizer seo={seo} />} />
          <Route path="/zh/tools/text-summarizer" element={<ToolsTextSummarizer seo={seo} />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    loadSEOConfig().then(setConfig).catch(() => setConfig(null));
    applyLanguageFromPath();
  }, []);

  if (!config) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Layout config={config} />
    </BrowserRouter>
  );
}