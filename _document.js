// In your _document.js (if using Pages Router)
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html suppressHydrationWarning>
      <Head />
      <body suppressHydrationWarning>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}