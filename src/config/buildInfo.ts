/**
 * TAMIZN VISA - Build Information
 * Injected at build time by Vite.
 */

declare const __APP_BUILD_TIME__: string | undefined;

export const BUILD_INFO = {
  version: '2.0',
  buildStamp: typeof __APP_BUILD_TIME__ !== 'undefined'
    ? `Version 2.0 | Built ${__APP_BUILD_TIME__}`
    : `Version 2.0 | Built ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })} IST`,
};
