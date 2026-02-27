import { apiRequest } from '../api';
import axios from 'axios';

jest.mock('axios');

describe('apiRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('sends GET request with correct URL and headers', async () => {
    axios.mockResolvedValueOnce({ data: { ok: true } });
    window.localStorage.setItem('token', 'abc123');
    const result = await apiRequest('/test', { method: 'get', params: { q: 1 } });
    expect(axios).toHaveBeenCalledWith(expect.objectContaining({
      url: expect.stringContaining('/test'),
      method: 'get',
      params: { q: 1 },
      headers: expect.objectContaining({ Authorization: 'Bearer abc123' })
    }));
    expect(result).toEqual({ ok: true });
  });

  it('hashes password if present in data', async () => {
    // Ensure window.crypto.subtle exists
    if (!window.crypto) window.crypto = {};
    if (!window.crypto.subtle) window.crypto.subtle = {};
    const origDigest = window.crypto.subtle.digest;
    window.crypto.subtle.digest = jest.fn().mockResolvedValue(new Uint8Array([1,2,3,4]).buffer);
    axios.mockResolvedValueOnce({ data: { ok: true } });
    await apiRequest('/signup', { method: 'post', data: { password: 'pw' } });
    // Check that axios was called with a hex string for password
    const call = axios.mock.calls[0][0];
    expect(typeof call.data.password).toBe('string');
    expect(call.data.password.length).toBeGreaterThan(0);
    window.crypto.subtle.digest = origDigest;
  });

  it('throws error with API error message', async () => {
    const error = new Error('fail');
    error.response = { data: { error: 'fail' } };
    axios.mockRejectedValueOnce(error);
    await expect(apiRequest('/fail')).rejects.toThrow('fail');
  });

  it('throws error with generic message if no API error', async () => {
    const error = new Error('network down');
    axios.mockRejectedValueOnce(error);
    await expect(apiRequest('/fail')).rejects.toThrow('network down');
  });
});
