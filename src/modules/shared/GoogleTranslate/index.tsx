// 'use client';
// import { useEffect } from 'react';

// declare global {
//   interface Window {
//     googleTranslateElementInit: () => void;
//     google: any;
//   }
// }

// const GoogleTranslate = () => {
//   useEffect(() => {
//     if (document.getElementById('google-translate-script')) return;

//     const script = document.createElement('script');
//     script.id = 'google-translate-script';
//     script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
//     document.body.appendChild(script);

//     window.googleTranslateElementInit = function () {
//       new window.google.translate.TranslateElement(
//         {
//           pageLanguage: 'vi',
//           includedLanguages: 'en,vi,ja,ko,zh-CN',
//           layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
//         },
//         'google_translate_element'
//       );
//     };
//   }, []);

//   return <div id="google_translate_element" />
// };

// export default GoogleTranslate;

'use client';
import { useEffect, useState } from 'react';
import './GoogleTranslate.css';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const GoogleTranslate = () => {
  const [currentLang, setCurrentLang] = useState('vi');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

 
  const languages = [
    { code: 'vi', name: 'Tiếng Việt', flag: '/flags/vn.png' },
    { code: 'en', name: 'English', flag: '/flags/en.png' },
    { code: 'ja', name: '日本語', flag: '/flags/ja.png' },
    { code: 'kr', name: '한국어', flag: '/flags/kr.png' },
    { code: 'zh-CN', name: '中文 (简体)', flag: '/flags/cn.png' },
  ];

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (document.getElementById('google-translate-script')) return;

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'vi',
          includedLanguages: 'en,vi,ja,ko,zh-CN',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    addGoogleTranslateScript();
  }, []);

  const changeLanguage = (langCode: string) => {
    console.log(`Attempting to change language to: ${langCode}`);

    // Đặt ngôn ngữ hiện tại trong React state để cập nhật UI ngay lập tức
    setCurrentLang(langCode);
    setIsDropdownOpen(false);

    // Sử dụng setTimeout để đảm bảo widget của Google đã sẵn sàng
    setTimeout(() => {
      const googleTranslateElement = document.getElementById('google_translate_element');
      if (googleTranslateElement) {
        // Sử dụng selector cụ thể hơn để chắc chắn tìm đúng element
        const selectElement = googleTranslateElement.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (selectElement) {
          console.log('Found Google Translate select element:', selectElement);
          selectElement.value = langCode;
          // Tạo và gửi đi sự kiện 'change' để Google Translate xử lý
          selectElement.dispatchEvent(new Event('change'));
          console.log('Language change event dispatched.');
        } else {
          console.error('Could not find the Google Translate select element (.goog-te-combo).');
        }
      } else {
        console.error('Could not find the google_translate_element container.');
      }
    }, 100); // Thêm một độ trễ nhỏ 100ms
  };

  const currentFlag = languages.find(lang => lang.code === currentLang)?.flag || '/flags/vi.png';

  return (
    <div className="custom-google-translate">
      {/* Container ẩn cho widget của Google */}
      <div id="google_translate_element" style={{ display: 'none' }} />

      <div className="language-switcher">
        <button className="current-language-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <img src={currentFlag} alt={currentLang} className="flag-icon" />
        </button>
        {isDropdownOpen && (
          <div className="language-dropdown">
            {languages.map((language) => (
              <button key={language.code} onClick={() => changeLanguage(language.code)}>
                <img src={language.flag} alt={language.code} className="flag-icon" />
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleTranslate;