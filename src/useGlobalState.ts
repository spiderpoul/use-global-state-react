import { useState, useCallback, useEffect, Dispatch, SetStateAction } from 'react';

const GLOBAL_STORE_CHANGE_EVENT = '__GLOBAL_STORE_CHANGE_EVENT__';

const dispatchEvent = <T>(key: string, value: T) => {
  window.dispatchEvent(
      new CustomEvent(GLOBAL_STORE_CHANGE_EVENT, {
        detail: { key, value },
      })
  );
};

const useGlobalState = <T>(key: string, initialState?: T) => {
  const [value, setValue] = useState(initialState);

  const updateValue: Dispatch<SetStateAction<T>> = useCallback((newValue) => {
    if (typeof newValue === 'function') {
      setValue((prev) => {
        const computedNewValue = (newValue as (prev: T) => T)(prev as T);
        dispatchEvent(key, computedNewValue);

        return computedNewValue;
      });

      return;
    }

    dispatchEvent(key, newValue);
  }, [key]);

  useEffect(() => {
    const onValueChange = (((e: { detail: { value: T; key: string } }) => {
      if (e.detail.key === key) {
        setValue(e?.detail?.value);
      }
    }) as unknown) as (e: Event) => void;

    window.addEventListener(GLOBAL_STORE_CHANGE_EVENT, onValueChange);

    return () => {
      window.removeEventListener(
          GLOBAL_STORE_CHANGE_EVENT,
          onValueChange
      );
    };
  }, [key]);

  const result = [value, updateValue]

  // eslint-disable-next-line prettier/prettier
  return result as [value: T, updateValue: typeof updateValue];
};

const createGlobalStore = <T>(key: string, initialState?: T) => () => useGlobalState<T>(key, initialState)


export {useGlobalState, createGlobalStore};
