import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should format log message in TSKV format', () => {
    logger.log('test message');

    const output = consoleSpy.mock.calls[0][0];
    expect(output).toContain('level=log');
    expect(output).toContain('message=test message');
    expect(output).toContain('timestamp=');
  });

  it('should format error message in TSKV format', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    logger.error('test error');

    const output = (console.error as jest.Mock).mock.calls[0][0];
    expect(output).toContain('level=error');
    expect(output).toContain('message=test error');
    expect(output).toContain('timestamp=');

    (console.error as jest.Mock).mockRestore();
  });

  it('should format warn message in TSKV format', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    logger.warn('test warn');

    const output = (console.warn as jest.Mock).mock.calls[0][0];
    expect(output).toContain('level=warn');
    expect(output).toContain('message=test warn');
    expect(output).toContain('timestamp=');

    (console.warn as jest.Mock).mockRestore();
  });

  it('should use tab as separator', () => {
    logger.log('test');

    const output = consoleSpy.mock.calls[0][0];
    expect(output).toContain('\t');
  });

  it('should include optionalParams when they are strings', () => {
    logger.log('test', 'param1', 'param2');

    const output = consoleSpy.mock.calls[0][0];
    expect(output).toContain('optionalParams=param1 param2');
  });

  it('should not include empty optionalParams', () => {
    logger.log('test');

    const output = consoleSpy.mock.calls[0][0];
    expect(output).not.toContain('optionalParams=');
  });
});
