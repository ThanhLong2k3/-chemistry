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
  { code: 'ko', name: '한국어', flag: '/flags/kr.png' }, // code phải là 'ko'
  { code: 'zh-CN', name: '中文 (简体)', flag: '/flags/cn.png' },
];

export default function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState('vi');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // chờ select của Google xuất hiện (reject nếu timeout)
  const waitForGoogleCombo = (timeout = 5000) =>
    new Promise<HTMLSelectElement>((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        // Google có thể tạo select với class 'goog-te-combo'
        const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
        if (select) return resolve(select);

        // trong 1 số trường hợp, google render inside #google_translate_element
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

  useEffect(() => {
    // load script chỉ 1 lần
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
    script.onload = () => console.info('[GT] translate script loaded');
    script.onerror = () => console.error('[GT] failed to load translate script (maybe blocked by CSP/AdBlock)');
    document.body.appendChild(script);
  }, []);

  // helper set cookie googtrans (fallback)
  const setGoogTransCookie = (from: string, to: string) => {
    const cookieValue = `/${from}/${to}`;
    try {
      // set without domain (works for localhost)
      document.cookie = `googtrans=${cookieValue};path=/;max-age=31536000`;
      // attempt to set on root domain too (may fail on localhost)
      const hostParts = location.hostname.split('.');
      if (hostParts.length > 1) {
        const root = '.' + hostParts.slice(-2).join('.');
        document.cookie = `googtrans=${cookieValue};path=/;domain=${root};max-age=31536000`;
      }
    } catch (e) {
      console.warn('[GT] set cookie error', e);
    }
  };

  // main change function: try instant select change, otherwise cookie+reload
  const changeLanguage = async (langCode: string) => {
    console.info('[GT] attempt change to', langCode);
    setCurrentLang(langCode);
    setIsDropdownOpen(false);

    // Try to change via select (no reload)
    try {
      const select = await waitForGoogleCombo(4000);
      console.info('[GT] found select element, switching via select', select);
      select.value = langCode;
      // dispatch old-style HTMLEvents change
      const ev = document.createEvent('HTMLEvents');
      ev.initEvent('change', true, true);
      select.dispatchEvent(ev);

      // sometimes need a tiny click trigger on the container
      const container = document.getElementById('google_translate_element');
      if (container) {
        container.dispatchEvent(new Event('change', { bubbles: true }));
      }

      console.info('[GT] language change dispatched via select');
      return;
    } catch (err) {
      console.warn('[GT] select not found or change failed:', (err as Error).message);
    }

    // FALLBACK: set cookie and reload page (reliable)
    console.info('[GT] using cookie fallback + reload');
    // use 'vi' as source language — change if you want 'auto'
    setGoogTransCookie('vi', langCode);
    // give browser a tick to set cookie then reload
    setTimeout(() => {
      // preserve hash & search
      window.location.reload();
    }, 100);
  };

  const currentFlag = languages.find((l) => l.code === currentLang)?.flag || '/flags/vn.png';

  return (
    <div className="custom-google-translate" style={{ display: 'inline-block' }}>
      {/* widget Google: đẩy ra ngoài vùng nhìn thấy, không dùng display:none */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', top: 0 }} />

      <div className="language-switcher">
        <button className="current-language-button" onClick={() => setIsDropdownOpen((s) => !s)}>
          <img src={currentFlag} alt={currentLang} style={{ width: 20, height: 14 }} />
        </button>

        {isDropdownOpen && (
          <div className="language-dropdown" style={{ position: 'absolute', background: '#fff', border: '1px solid #ddd', zIndex: 9999 }}>
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                style={{ display: 'flex', alignItems: 'center', padding: '6px 10px', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <img src={language.flag} alt={language.code} style={{ width: 20, height: 14, marginRight: 8 }} />
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
