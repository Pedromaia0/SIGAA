/**
 * Cross-browser WebExtension API wrapper.
 * Usa `browser` se disponível (Firefox) caso contrário `chrome`.
 */
const browserAPI = globalThis.browser ?? globalThis.chrome;