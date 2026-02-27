import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns initial value if not in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'init'));
    expect(result.current[0]).toBe('init');
  });

  it('reads value from localStorage if present', () => {
    window.localStorage.setItem('testKey', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('testKey', 'init'));
    expect(result.current[0]).toBe('stored');
  });

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'init'));
    act(() => {
      result.current[1]('newVal');
    });
    expect(window.localStorage.getItem('testKey')).toBe(JSON.stringify('newVal'));
    expect(result.current[0]).toBe('newVal');
  });

  it('removes key from localStorage when set to null', () => {
    window.localStorage.setItem('testKey', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('testKey', 'init'));
    act(() => {
      result.current[1](null);
    });
    expect(window.localStorage.getItem('testKey')).toBeNull();
  });
});
