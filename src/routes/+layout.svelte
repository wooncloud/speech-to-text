<script>
  import "../app.postcss";
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="theme-color" content="#ffffff" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <title>Speech to Text - 음성을 텍스트로 변환</title>
  <meta name="description" content="말씀하신 내용을 텍스트로 변환해주는 웹 애플리케이션입니다." />
  
  <link rel="manifest" href="manifest.webmanifest" />
  <link rel="icon" href="favicon.ico" sizes="any" />
  <link rel="icon" href="icon.png" type="image/png" />
  <link rel="apple-touch-icon" href="apple-touch-icon.png" />
  
  <meta property="og:title" content="Speech to Text - 음성을 텍스트로 변환" />
  <meta property="og:description" content="말씀하신 내용을 텍스트로 변환해주는 웹 애플리케이션입니다." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://speech-totext.vercel.app" />
  <meta property="og:image" content="https://speech-totext.vercel.app/og-image.png" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Speech to Text - 음성을 텍스트로 변환" />
  <meta name="twitter:description" content="말씀하신 내용을 텍스트로 변환해주는 웹 애플리케이션입니다." />
  <meta name="twitter:image" content="https://speech-totext.vercel.app/og-image.png" />
</svelte:head>

<slot /> 