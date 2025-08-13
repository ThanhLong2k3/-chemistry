'use client';
import { useEffect, useState } from 'react';
import './GoogleTranslate.css';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const languages = [
  { code: 'vi', name: 'Tiếng Việt', flag: '/flags/vn.png' },
  { code: 'en', name: 'English', flag: '/flags/en.png' },
  { code: 'ja', name: '日本語', flag: '/flags/ja.png' },
  { code: 'ko', name: '한국어', flag: '/flags/kr.png' },
  { code: 'zh-CN', name: '中文 (简体)', flag: '/flags/cn.png' },
];

export default function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState('vi');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ====== Helper: chờ Google select xuất hiện ======
  const waitForGoogleCombo = (timeout = 5000) =>
    new Promise<HTMLSelectElement>((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
        if (select) return resolve(select);

        const container = document.getElementById('google_translate_element');
        if (container) {
          const selInside = container.querySelector<HTMLSelectElement>('select');
          if (selInside) return resolve(selInside);
        }

        if (Date.now() - start > timeout) return reject(new Error('timeout waiting for goog-te-combo'));
        setTimeout(check, 150);
      };
      check();
    });

  // ====== Lấy currentLang từ localStorage hoặc cookie ======
  useEffect(() => {
    const savedLang = localStorage.getItem('currentLang');
    if (savedLang) {
      setCurrentLang(savedLang);
      return;
    }

    const match = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
    if (match && match[1]) {
      setCurrentLang(match[1]);
    }
  }, []);

  // ====== Load script Google Translate ======
  useEffect(() => {
    if (document.getElementById('google-translate-script')) return;

    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'vi',
            includedLanguages: 'en,vi,ja,ko,zh-CN',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
        console.info('[GT] googleTranslateElementInit executed');
      } catch (err) {
        console.error('[GT] error in googleTranslateElementInit', err);
      }
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ====== Set cookie googtrans (fallback) ======
  const setGoogTransCookie = (from: string, to: string) => {
    const cookieValue = `/${from}/${to}`;
    try {
      document.cookie = `googtrans=${cookieValue};path=/;max-age=31536000`;
      const hostParts = location.hostname.split('.');
      if (hostParts.length > 1) {
        const root = '.' + hostParts.slice(-2).join('.');
        document.cookie = `googtrans=${cookieValue};path=/;domain=${root};max-age=31536000`;
      }
    } catch (e) {
      console.warn('[GT] set cookie error', e);
    }
  };

  // ====== Change language ======
  const changeLanguage = async (langCode: string) => {
    console.info('[GT] attempt change to', langCode);
    setCurrentLang(langCode);
    localStorage.setItem('currentLang', langCode); // Lưu vào localStorage
    setIsDropdownOpen(false);

    try {
      const select = await waitForGoogleCombo(4000);
      select.value = langCode;
      const ev = document.createEvent('HTMLEvents');
      ev.initEvent('change', true, true);
      select.dispatchEvent(ev);

      const container = document.getElementById('google_translate_element');
      if (container) {
        container.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return;
    } catch (err) {
      console.warn('[GT] select not found or change failed:', (err as Error).message);
    }

    console.info('[GT] using cookie fallback + reload');
    setGoogTransCookie('vi', langCode);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const currentFlag = languages.find((l) => l.code === currentLang)?.flag || '/flags/vn.png';

  return (
    <div className="custom-google-translate" style={{ display: 'inline-block' }}>
      {/* Google widget hidden */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', top: 0 }} />

      <div className="language-switcher">
        <button
          className="current-language-button"
          onClick={() => setIsDropdownOpen((s) => !s)}
        >
          <img src={currentFlag} alt={currentLang} style={{ width: 20, height: 14 }} />
        </button>

        {isDropdownOpen && (
          <div
            className="language-dropdown"
            style={{
              position: 'absolute',
              background: '#fff',
              border: '1px solid #ddd',
              zIndex: 9999
            }}
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 10px',
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={language.flag}
                  alt={language.code}
                  style={{ width: 20, height: 14, marginRight: 8 }}
                />
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
