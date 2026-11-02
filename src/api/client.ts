import { BASE_URL, TIMEOUT } from '../config';

export async function request<T = any>(
  method: string,
  url: string,
  body?: any,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const ctrl = new AbortController();
  timer = setTimeout(() => {
    ctrl.abort();
  }, TIMEOUT);

  try {
    const opts: RequestInit = {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: ctrl.signal,
    };

    if (body !== undefined && body !== null) {
      opts.body = JSON.stringify(body);
    }

    const res = await fetch(BASE_URL + url, opts);
    if (timer) {
      clearTimeout(timer);
    }

    if (!res.ok) {
      const errObj = {
        type: 'http',
        status: res.status,
        message: 'Lỗi máy chủ (' + res.status + ')',
      };
      throw errObj;
    }

    const data = await res.json();
    console.log('res:', url);
    return data as T;
  } catch (err: any) {
    if (timer) {
      clearTimeout(timer);
    }
    if (err && err.type) {
      throw err;
    }
    if (err && err.name === 'AbortError') {
      const timeoutErr = {
        type: 'timeout',
        status: 0,
        message: 'Hết thời gian kết nối máy chủ',
      };
      throw timeoutErr;
    }
    const netErr = {
      type: 'network',
      status: 0,
      message: 'Không thể kết nối mạng hoặc máy chủ đang tắt',
    };
    throw netErr;
  }
}

export default {
  request,
};

