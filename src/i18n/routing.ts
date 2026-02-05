import { defineRouting } from 'next-intl/routing';

export const locales = ['fr', 'en', 'ar', 'es', 'de', 'pt', 'it', 'nl', 'tr', 'ja'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
});
