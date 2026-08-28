import Script from "next/script";

export default function GoogleAnalyticsComponent() {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  if (!gaId || process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <Script id="google-analytics-init" strategy="lazyOnload">
      {`
        if (typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
          const script = document.createElement('script');
          script.src = 'https://www.googletagmanager.com/gtag/js?id=${gaId}';
          script.async = true;
          document.head.appendChild(script);

          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}');
        }
      `}
    </Script>
  );
}
