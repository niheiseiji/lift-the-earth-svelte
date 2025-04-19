/** 保存したJWTを取得します */
export function getToken() {
    return localStorage.getItem('token');
}

/**
 * JWTを保存します
 * @param {string} token
 */
export function saveToken(token) {
    localStorage.setItem('token', token);
}

/** トークンを削除します（ログアウト用） */
export function clearToken() {
    localStorage.removeItem('token');
}

/** 認証状態を返します */
export function isAuthenticated() {
    return !!getToken();
}

/** 認証状態を返します */
export function logout() {
    clearToken();
}
