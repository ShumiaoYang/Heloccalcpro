import React from 'react';
import i18n from '../i18n';

export default function Home({ seo }: { seo: any }) {
  return (
    <div>
      <h1>{seo.h1 || i18n.t('home.h1')}</h1>
      {Array.isArray(seo.h2) && seo.h2[0] && <h2>{seo.h2[0]}</h2>}
      {Array.isArray(seo.h3) && seo.h3[0] && <h3>{seo.h3[0]}</h3>}
      <p>Home content placeholder...</p>
    </div>
  );
}