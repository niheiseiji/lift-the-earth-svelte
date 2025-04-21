import { getToken } from './auth';

const BASE_URL = 'http://localhost:8080/api';

/**
 * ログインAPIを呼び出します
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} JWTトークン
 */
export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'ログイン失敗');
  }

  const data = await res.json();
  return data.token;
};

/**
 * JWTを使って現在のユーザー情報を取得
 * @returns {Promise<{id: number, email: string, createdAt: string}>}
 */
export async function fetchMe() {
  const token = getToken();
  if (!token) throw new Error('ログインしていません');

  const res = await fetch('http://localhost:8080/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error('トークンが無効、または期限切れです');
  }

  return await res.json();
}
