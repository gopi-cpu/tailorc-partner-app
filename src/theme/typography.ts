import { Platform, TextStyle } from 'react-native';

// Inject Google Fonts Open Sans on web platforms
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const fontId = 'google-font-tailord-suite';
  if (!document.getElementById(fontId)) {
    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap';
    document.head.appendChild(link);
  }

  const styleId = 'global-typography-font-smoothing';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      * {
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
      body, #root, div[dir="auto"], span[dir="auto"], [class*="css-text"] {
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
      input, button, select, textarea {
        font-family: inherit !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// Clean, ultra-modern, crisp typography stack (Open Sans)
export const fontFamily = Platform.select({
  ios: 'Open Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  android: 'sans-serif',
  web: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  default: 'sans-serif'
});

export const fontFamilyHeading = Platform.select({
  ios: 'Open Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  android: 'sans-serif-medium',
  web: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  default: 'sans-serif'
});

export const fontFamilySerif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: '"Open Sans", Georgia, serif',
  default: 'serif'
});

export const fontSizes = {
  hero: 26,
  h1: 22,
  h2: 19,
  h3: 16,
  body: 14.5,
  bodySmall: 13,
  caption: 12,
  tiny: 11
};

export const typography = {
  hero: {
    fontFamily,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
    letterSpacing: -0.6
  } as TextStyle,
  h1: {
    fontFamily,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    letterSpacing: -0.5
  } as TextStyle,
  h2: {
    fontFamily,
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 25,
    letterSpacing: -0.4
  } as TextStyle,
  h3: {
    fontFamily,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.3
  } as TextStyle,
  body: {
    fontFamily,
    fontSize: 14.5,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.1
  } as TextStyle,
  bodyBold: {
    fontFamily,
    fontSize: 14.5,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: -0.2
  } as TextStyle,
  bodySmall: {
    fontFamily,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: -0.1
  } as TextStyle,
  bodySmallBold: {
    fontFamily,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    letterSpacing: -0.2
  } as TextStyle,
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0
  } as TextStyle,
  badge: {
    fontFamily,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3
  } as TextStyle,
  price: {
    fontFamily,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    letterSpacing: -0.4
  } as TextStyle
};
