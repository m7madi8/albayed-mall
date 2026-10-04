import { ScrollViewStyleReset } from "expo-router/html";
import { palette } from "@/theme/palette";
import type { PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content={palette.primaryDark} />
        <meta
          name="description"
          content="مول البايض — تصفّح جميع أصناف المول، أضف إلى السلة، وأتمم الطلب من أي جهاز."
        />
        <title>مول البايض | تسوق إلكتروني</title>
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveCss = `
  html, body, #root {
    min-height: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  * {
    box-sizing: border-box;
  }
`;
