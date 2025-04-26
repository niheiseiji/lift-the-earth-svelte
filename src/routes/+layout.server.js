// src/routes/+layout.server.js

import { serverFetchMe } from '$lib/api';
import { redirect } from '@sveltejs/kit';

export async function load({ fetch, cookies, url }) {
  const path = url.pathname;

  if (path.startsWith('/login')) {
    return {};
  }

  try {
    const user = await serverFetchMe({ fetch });
    console.log('user', user);
    return { user };
  } catch (e) {
    console.error('認証エラー', e);
    throw redirect(302, '/login');
  }
}
