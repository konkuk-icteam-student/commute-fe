"use client";

import { useEffect, useState } from "react";

const DEFAULT_DELAY = 300;

// 값이 멎을 때까지 기다렸다가 넘긴다. 글자를 칠 때마다 조회가 나가는 것을 막는 데 쓴다.
// 값이 바뀌면 이전 타이머를 버리므로, 마지막 입력 기준으로 한 번만 반영된다.
export function useDebouncedValue<T>(value: T, delay = DEFAULT_DELAY) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timerId);
  }, [value, delay]);

  return debouncedValue;
}
