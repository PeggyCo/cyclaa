/**
 * Secure token storage.
 * expo-secure-store has no web implementation, so we fall back to
 * localStorage on `expo start --web`.
 */
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-undef
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-undef
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

export async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-undef
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}
