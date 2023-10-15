export const script = () => {
  const scripts = [
    "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/video.js/8.5.2/video.min.js",
  ];

  scripts.forEach((p) => {
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.src = p;
    document.documentElement.appendChild(script);
  });
};