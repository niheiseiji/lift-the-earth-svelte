const BASE_URL = 'http://localhost:8080/api';

/**
 * ログインAPIを呼び出します
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} JWTトークン
 */
export async function login(email, password) {
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
}
