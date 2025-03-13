const { session } = require('electron');

const setupCSP = () => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self';",
          "script-src 'self';",
          "style-src 'self' 'unsafe-inline';",
          "img-src 'self' data: https:;",
          "connect-src 'self';",
          "font-src 'self';",
          "object-src 'none';",
          "media-src 'self';",
          "frame-src 'none';",
          "base-uri 'self';",
          "form-action 'self';"
        ].join(' ')
      }
    });
  });
};

module.exports = { setupCSP };