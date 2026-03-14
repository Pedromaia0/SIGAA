/**
 * Cross-browser WebExtension API wrapper.
 * Usa `browser` se disponível (Firefox) caso contrário `chrome`.
 */
var browserAPI = globalThis.browser ?? globalThis.chrome;