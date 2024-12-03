import { EpcsOAuthClient } from './client';

type Payload = { [key: string]: number | string | Date | Object | null };

class HTTP {
  private client?: EpcsOAuthClient;

  constructor(client?: EpcsOAuthClient) {
    this.client = client;
  }

  async httpGet(url: string, format: 'json' | 'text' = 'json', payload: Payload = {}) {
    const u = new URLSearchParams();
    for (const k of Object.keys(payload)) {
      const v = payload[k];
      if (v) {
        u.append(k, v.toString());
      }
    }
    let response: any;
    let data: any;

    try {
      const headers = new Headers();
      const fetchUrl = `${url}${Object.keys(payload).length > 0 ? `?${u.toString()}` : ''}`;
      headers.append('Content-Type', 'application/json');

      if (this.client && this.client.token) {
        this.client.checkExistingToken();
        headers.append('Authorization', `Bearer ${this.client.token}`);
        response = await fetch(fetchUrl, { headers, credentials: 'omit' });

        if (response && response.status === 401) {
          const isTokenValid = await this.client.checkTokenValidity(this.client.token);
          if (!isTokenValid) {
            this.client.clearAndLogin();
          }
        }
      }
    } finally {
      if (response && response.ok) {
        switch (format) {
          default:
          case 'json':
            data = await response.json();
            break;
          case 'text':
            data = await response.text();
            break;
        }
      } else {
        throw response;
      }
    }
    return data;
  }

}

export { HTTP, type Payload };
