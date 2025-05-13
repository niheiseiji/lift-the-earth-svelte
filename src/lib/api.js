const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * リフレッシュトークンを使って新しいアクセストークン（JWT）を取得します。
 *
 * @throws {Error} リフレッシュトークンが無効な場合
 * @returns {Promise<void>}
 */
const refreshToken = async () => {
  const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error('リフレッシュトークンが無効です');
  }
};

/**
 * JWTの期限切れ時に自動で再認証を試みるfetchラッパーです。
 *
 * @param {RequestInfo} input - fetchのURLまたはRequestオブジェクト
 * @param {RequestInit} [init={}] - fetchの初期化オプション
 * @param {boolean} [retry=true] - 再試行を行うかどうか（内部制御用）
 * @returns {Promise<Response>} - fetchのレスポンス
 * @throws {Error} 認証が切れており、再ログインが必要な場合
 */
const authFetch = async (input, init = {}, retry = true) => {
  const res = await fetch(input, { ...init, credentials: 'include' });

  if (res.status === 401 && retry) {
    try {
      await refreshToken();
      return await authFetch(input, init, false); // 1回だけリトライ
    } catch (e) {
      throw new Error('認証が切れました。再ログインしてください。');
    }
  }

  return res;
};

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

/**
 * 現在のユーザー情報を取得
 * @returns {Promise<{id: number, email: string, name: string, createdAt: string}>}
 */
export const fetchMe = async () => {
  const res = await authFetch(`${BASE_URL}/user/me`, {
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error('トークンが無効、または期限切れです');
  }

  return await res.json();
};

/**
 * ユーザーを更新
 * @param {string} name
 */
export const updateUserSetting = async ({ displayName, uniqueName }) => {
  const res = await authFetch(`${BASE_URL}/user/setting`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ displayName, uniqueName }),
  });

  if (!res.ok) {
    throw new Error('ユーザーの更新に失敗しました');
  }
};

/**
 * ユーザーのプロフィール画像更新
 * @param {string} name
 */
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await authFetch(`${BASE_URL}/user/upload-profile-image`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  });

  if (!res.ok) throw new Error('アップロード失敗');
  return await res.text();
};

/**
 * トレーニングを新規登録する
 * @param {{ performedAt: string, trainingMenus: Array }} trainingData
 * @returns {Promise<any>}
 */
export const createTraining = async (trainingData) => {
  const res = await authFetch(`${BASE_URL}/trainings`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(trainingData)
  });

  if (!res.ok) {
    throw new Error('トレーニングの保存に失敗しました');
  }

  return await res.json();
};

/**
 * 全トレーニングを取得する（ログインユーザーの分のみ）
 * @returns {Promise<TrainingDto[]>}
 */
export const fetchTrainings = async () => {
  const res = await authFetch(`${BASE_URL}/trainings`, {
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error('トレーニング一覧の取得に失敗しました');
  }

  return await res.json();
};

/**
 * トレーニング詳細を取得する
 * @param {number} id
 * @returns {Promise<TrainingDto>}
 */
export const fetchTrainingById = async (id) => {
  const res = await authFetch(`${BASE_URL}/trainings/${id}`, {
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error('トレーニングの取得に失敗しました');
  }

  return await res.json();
};

/**
 * トレーニングを更新する
 * @param {number} id
 * @param {TrainingDto} trainingData
 * @returns {Promise<TrainingDto>}
 */
export const updateTraining = async (id, trainingData) => {
  const res = await authFetch(`${BASE_URL}/trainings/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(trainingData)
  });

  if (!res.ok) {
    throw new Error('トレーニングの更新に失敗しました');
  }

  return await res.json();
};

/**
 * トレーニングを削除する
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteTraining = async (id) => {
  const res = await authFetch(`${BASE_URL}/trainings/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error('トレーニングの削除に失敗しました');
  }
};

/**
 * トレーニングサマリを取得する
 * @returns {Promise<TrainingSummaryDto>}
 */
export const fetchTrainingSummary = async () => {
  const res = await authFetch(`${BASE_URL}/trainings/summary`, {
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error('トレーニングサマリの取得に失敗しました');
  }

  return await res.json();
};

/**
 * プリセットを新規登録する
 * @param {{ presetName: string, trainingMenus: Array }} presetData
 * @returns {Promise<any>}
 */
export const createPresetTraining = async (presetData) => {
  const res = await authFetch(`${BASE_URL}/preset-trainings`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(presetData)
  });

  if (!res.ok) {
    throw new Error('プリセットの保存に失敗しました');
  }

  return await res.json();
};

/**
 * 全プリセットを取得する（ログインユーザーの分のみ）
 * @returns {Promise<PresetTrainingDto[]>}
 */
export const fetchPresetTrainings = async () => {
  const res = await authFetch(`${BASE_URL}/preset-trainings`, {
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error('プリセット一覧の取得に失敗しました');
  }

  return await res.json();
};

/**
 * プリセット詳細を取得する
 * @param {number} id
 * @returns {Promise<PresetTrainingDto>}
 */
export const fetchPresetTrainingById = async (id) => {
  const res = await authFetch(`${BASE_URL}/preset-trainings/${id}`, {
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error('プリセットの取得に失敗しました');
  }

  return await res.json();
};

/**
 * プリセットを更新する
 * @param {number} id
 * @param {PresetTrainingDto} presetData
 * @returns {Promise<PresetTrainingDto>}
 */
export const updatePresetTraining = async (id, presetData) => {
  const res = await authFetch(`${BASE_URL}/preset-trainings/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(presetData)
  });

  if (!res.ok) {
    throw new Error('プリセットの更新に失敗しました');
  }

  return await res.json();
};

/**
 * プリセットを削除する
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deletePresetTraining = async (id) => {
  const res = await authFetch(`${BASE_URL}/preset-trainings/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error('プリセットの削除に失敗しました');
  }
};
