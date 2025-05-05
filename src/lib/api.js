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
  const res = await fetch(`${BASE_URL}/user/me`, {
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error('トークンが無効、または期限切れです');
  }

  return await res.json();
};

/**
 * ユーザー名を更新
 * @param {string} name
 */
export const updateUserName = async (name) => {
  const res = await fetch(`${BASE_URL}/user/setting`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  });

  if (!res.ok) {
    throw new Error('ユーザー名の更新に失敗しました');
  }
};

/**
 * トレーニングを新規登録する
 * @param {{ performedAt: string, trainingMenus: Array }} trainingData
 * @returns {Promise<any>}
 */
export const createTraining = async (trainingData) => {
  const res = await fetch(`${BASE_URL}/trainings`, {
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
  const res = await fetch(`${BASE_URL}/trainings`, {
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
  const res = await fetch(`${BASE_URL}/trainings/${id}`, {
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
  const res = await fetch(`${BASE_URL}/trainings/${id}`, {
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
  const res = await fetch(`${BASE_URL}/trainings/${id}`, {
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
  const res = await fetch(`${BASE_URL}/trainings/summary`, {
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error('トレーニングサマリの取得に失敗しました');
  }

  return await res.json();
};
