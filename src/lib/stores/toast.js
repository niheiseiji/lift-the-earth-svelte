import { writable } from 'svelte/store';

export const toast = writable({ visible: false, type: 'success', message: '' });

export const showToast = (message, type = 'success', duration = 3000) => {
  toast.set({ visible: true, type, message });
  setTimeout(() => {
    toast.set({ visible: false, type, message: '' });
  }, duration);
};
