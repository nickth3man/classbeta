const { setupCSP } = require('../../src/security/contentSecurityPolicy');
const { session } = require('electron');

jest.mock('electron', () => ({
  session: {
    defaultSession: {
      webRequest: {
        onHeadersReceived: jest.fn()
      }
    }
  }
}));

describe('Content Security Policy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should set up CSP headers', () => {
    setupCSP();
    expect(session.defaultSession.webRequest.onHeadersReceived).toHaveBeenCalled();

    const callback = session.defaultSession.webRequest.onHeadersReceived.mock.calls[0][0];
    const details = {
      responseHeaders: {}
    };
    const mockCallback = jest.fn();

    callback(details, mockCallback);

    expect(mockCallback).toHaveBeenCalledWith({
      responseHeaders: {
        'Content-Security-Policy': expect.stringContaining("default-src 'self'")
      }
    });
  });
});