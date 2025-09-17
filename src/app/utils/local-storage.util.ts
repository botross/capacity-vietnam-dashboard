'use server';
import { cookies } from 'next/headers';

export const clearLocalStorage = () => {
  localStorage.clear();
};

export const setLocalStorage = (key: string, value: string) => {
  const serializedValue = JSON.stringify(value);
  localStorage.setItem(key, serializedValue);
};

