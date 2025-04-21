const BASE_URL = 'http://localhost:8080/api';

/**
 * ログインAPIを呼び出します
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} JWTトークン
 */
export const login = async (email, password) => {
  const res = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error('ログインに失敗しました');
  }
};

/**
 * JWTを使って現在のユーザー情報を取得
 * @returns {Promise<{id: number, email: string, createdAt: string}>}
 */
export const fetchMe = async () => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    credentials: 'include' // ← Cookieを送る
  });

  if (!res.ok) {
    throw new Error('トークンが無効、または期限切れです');
  }

  return await res.json();
};

/**
 * ログアウトAPI呼び出し
 */
export const logout = async () => {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include' // ← Cookieを送る
  });

  if (!res.ok) {
    throw new Error('ログアウトに失敗しました');
  }
};
