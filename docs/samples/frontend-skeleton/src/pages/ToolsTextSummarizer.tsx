import React, { useState } from 'react';

export default function ToolsTextSummarizer({ seo }: { seo: any }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const onGenerate = () => {
    setLoading(true);
    setError('');
    setResult('');
    setTimeout(() => {
      setLoading(false);
      if (text.trim() === 'trigger-error') {
        setError('生成失败，请稍后再试。');
      } else {
        setResult('成功：这是一个模拟的AI响应。');
      }
    }, 400);
  };

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <h1>{seo.h1 || 'AI Text Summarizer'}</h1>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          style={{ width: '100%' }}
          placeholder="输入文本，点击生成；输入 trigger-error 以模拟错误"
        />
        <button onClick={onGenerate} disabled={loading} style={{ marginTop: 8 }}>
          生成
        </button>
      </div>
      <div style={{ flex: 3 }}>
        {loading && <div>Loading...</div>}
        {!loading && error && <div style={{ color: 'red' }}>{error}</div>}
        {!loading && !error && result && <div>{result}</div>}
      </div>
    </div>
  );
}