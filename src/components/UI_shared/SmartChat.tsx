'use client';

import Script from 'next/script';

export default function SmartChatComponent() {
  return (
    <>
      <Script
        src="https://app.smartchat.com.vn/chatbot-embed.js?chatbotCode=740ec53d-513e-462b-bb4b-b18dedd0fff2&pageID=716a5eb3-c6bf-4d1f-a697-f3174a742c7f"
        strategy="afterInteractive"
      />
    </>
  );
}
