import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should format log message as JSON', () => {
    logger.log('test message');

    const output = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(output.level).toBe('log');
    expect(output.message).toBe('test message');
    expect(output).toHaveProperty('timestamp');
  });

  it('should format error message as JSON', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    logger.error('test error');

    const output = JSON.parse((console.error as jest.Mock).mock.calls[0][0]);
    expect(output.level).toBe('error');
    expect(output.message).toBe('test error');
    expect(output).toHaveProperty('timestamp');

    (console.error as jest.Mock).mockRestore();
  });

  it('should format warn message as JSON', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    logger.warn('test warn');

    const output = JSON.parse((console.warn as jest.Mock).mock.calls[0][0]);
    expect(output.level).toBe('warn');
    expect(output.message).toBe('test warn');
    expect(output).toHaveProperty('timestamp');

    (console.warn as jest.Mock).mockRestore();
  });

  it('should include optionalParams in JSON', () => {
    logger.log('test', 'param1', 'param2');

    const output = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(output.optionalParams).toEqual(['param1', 'param2']);
  });
});
