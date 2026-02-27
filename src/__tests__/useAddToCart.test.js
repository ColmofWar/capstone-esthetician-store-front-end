import { renderHook, act } from '@testing-library/react';
import useAddToCart from '../hooks/useAddToCart';

jest.mock('../hooks/useLocalStorage', () => jest.fn());
jest.mock('../api', () => ({ apiRequest: jest.fn() }));
import useLocalStorage from '../hooks/useLocalStorage';
import { apiRequest } from '../api';

describe('useAddToCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error if not logged in', async () => {
    useLocalStorage.mockReturnValue([null]);
    const { result } = renderHook(() => useAddToCart());
    let ret;
    await act(async () => {
      ret = await result.current.addToCart({ id: 1 }, 2);
    });
    expect(ret).toBe(false);
    expect(result.current.error).toMatch(/logged in/i);
  });

  it('calls apiRequest and returns true on success', async () => {
    useLocalStorage.mockReturnValue(['user']);
    apiRequest.mockResolvedValueOnce({});
    const { result } = renderHook(() => useAddToCart());
    let ret;
    await act(async () => {
      ret = await result.current.addToCart({ id: 1 }, 2);
    });
    expect(apiRequest).toHaveBeenCalledWith('/shopping_cart_items/user', expect.any(Object));
    expect(ret).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('sets error and returns false on api failure', async () => {
    useLocalStorage.mockReturnValue(['user']);
    apiRequest.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useAddToCart());
    let ret;
    await act(async () => {
      ret = await result.current.addToCart({ id: 1 }, 2);
    });
    expect(ret).toBe(false);
    expect(result.current.error).toMatch(/fail/);
  });
});
