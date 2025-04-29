const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * ログインAPIを呼び出します
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} JWTトークン
 */
export const signup = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
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
 * ログインAPIを呼び出します
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} JWTトークン
 */
export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
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
 * JWTを使って現在のユーザー情報を取得
 * @returns {Promise<{id: number, email: string, createdAt: string}>}
 */
export const serverFetchMe = async ({ fetch }) => {
  console.log('###start serverFetchMe###');

  const res = await fetch(`${BASE_URL}/auth/me`, {
    credentials: 'include'
  });

  console.log('###start serverFetchMe fetch end###');

  if (!res.ok) {
    throw new Error('認証エラー');
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
