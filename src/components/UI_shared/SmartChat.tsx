'use client';

import Script from 'next/script';

export default function SmartChatComponent() {
  return (
    <>
      <Script
        src="https://app.smartchat.com.vn/chatbot-embed.js?chatbotCode=ff5c276f-76b1-468c-a2c2-48e999f3101b&pageID=1415948f-4651-4f3b-bd24-ab951931bb00"
        strategy="afterInteractive" 
      />
    </>
  );
}
