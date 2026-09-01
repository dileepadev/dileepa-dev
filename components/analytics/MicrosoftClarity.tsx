import Script from "next/script";

const microsoftClarityProjectId =
  process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_PROJECT_ID;

export default function MicrosoftClarity() {
  if (!microsoftClarityProjectId || process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <Script id="microsoft-clarity-analytics" strategy="lazyOnload">
      {`
        if (typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${microsoftClarityProjectId}");
        }
      `}
    </Script>
  );
}
