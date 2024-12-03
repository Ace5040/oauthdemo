import { OAuth2Client } from '@badgateway/oauth2-client';
import { ClientSettings } from '@badgateway/oauth2-client/dist/client';
import { BlitzUserProfile, OAuthToken, ServerResponse } from './models';
import { Payload } from './client-http';

class EpcsOAuthClient extends OAuth2Client {
  private clientSettings: ClientSettings;
  authenticated: boolean = false;
  token: string | null;
  tokenParsed: Record<string, any> | null;
  refToken: string | null;
  idToken: string | null;
  blitzServer: 'public' | 'internal' | undefined;

  constructor(clientSettings: ClientSettings) {
    super(clientSettings);
    this.clientSettings = clientSettings;
    this.token = localStorage.getItem('accessToken');
    this.refToken = localStorage.getItem('refreshToken');
    this.idToken = localStorage.getItem('idToken');
    this.tokenParsed = this._parseJwt(this.token ?? '');
  }

  /**
   * Установка параметра указывающего какой блиц использовать
   * @param blitzServer - 'internal' или` 'public'.
   */
  setBlitzServer(blitzServer: 'internal' | 'public'): void {
    this.blitzServer = blitzServer;
    this.clientSettings.authorizationEndpoint = `/blitz-${blitzServer}/oauth/ae`;
    this.clientSettings.discoveryEndpoint = `${document.location.origin}/blitz-${blitzServer}/oauth/.well-known/openid-configuration`;
  }

  /**
   * Генерация URL логина
   * @param redirectUri URL редиректа, на который произойдет переход после авторизации.
   */
  async createLoginUrl(redirectUri: string): Promise<string> {
    return await this.authorizationCode.getAuthorizeUri({
      redirectUri,
      scope: ['openid profile'],
      extraParams: { prompt: 'select_account' },
    });
  }

  /**
   * Генерация URL регистрации
   * @param redirectUri URL редиректа, на который произойдет переход после регистрации.
   */
  async createRegisterUrl(redirectUri: string): Promise<string> {
    return await this.authorizationCode.getAuthorizeUri({
      redirectUri,
      scope: ['openid profile'],
      extraParams: { bip_action_hint: 'open_reg' },
    });
  }

  /**
   * Инициализация инстанса клиента авторизации. Либо начальная генерация access_token и refresh_token используя code из URL, либо их обновление
   * @param redirectUri URL редиректа.
   * @param code код из URL после аутентификации.
   * @param forceUpdate необязательный признак принудительного обновления access токена.
   */
  async init(options: { redirectUri: string; code: string | null; forceUpdate?: boolean }) {
    if (options.code) {
      const requestOptions = {
        redirect_uri: options.redirectUri,
        code: options.code,
      };
      try {
        const res = await this._httpPost<ServerResponse<OAuthToken>>(`/api/token-service-${this.blitzServer}/token/access-token`, requestOptions);
        this._updateData(res.data);
      } catch (error: any) {
        if (error.errMessage.error === 'invalid_grant') {
          this._clearData();
          document.location = await this.createLoginUrl(requestOptions.redirect_uri);
          throw new Error(error.response);
        }

        this._clearData();
        throw new Error(error.response);
      }
    } else {
      this.checkExistingToken();
    }
  }

  /**
   * Проверка на то что токен существует, он валидный и не истек срок действия.
   * @param forceUpdate необязательный признак принудительного обновления access токена.
   */
  async updateToken(forceUpdate: boolean = false) {
    this.checkExistingToken();
  }

  checkExistingToken() {
    this.token = localStorage.getItem('accessToken');
    this.refToken = localStorage.getItem('refreshToken');
    this.idToken = localStorage.getItem('idToken');
    this.tokenParsed = this._parseJwt(this.token ?? '');
    if (Object.keys(this.tokenParsed).length === 0) {
      return;
    }

    this.authenticated = this.tokenParsed.exp * 1000 > new Date().getTime();
  }

  async clearAndLogin() {
    this._clearData();
    document.location = await this.createLoginUrl(`${window.location.origin}${window.location.pathname}`);
  }

  /**
   * Валидация access_token.
   * @param token access_token.
   */
  async checkTokenValidity(token: string): Promise<boolean> {
    try {
      const res = await this._httpPost<ServerResponse<{ result: boolean }>>(`/api/token-service-${this.blitzServer}/token/access-token/introspect`, { token });
      return res.data.result;
    } catch (error: any) {
      this._clearData();
      throw new Error(error);
    }
  }

  /**
   * Генерация URL выхода
   * @param redirectUri URL редиректа, на который произойдет переход после авторизации.
   */
  logout(redirectUri: string): string {
    this._clearData();
    return `${this.clientSettings.server}/blitz-${this.blitzServer}/oauth/logout?id_token_hint=${this.idToken}&post_logout_redirect_uri=${redirectUri}`;
  }

  /**
   * Парсинг access_token и возврат объекта blitzUser
   */
  loadUserProfile(): BlitzUserProfile {
    const parsedToken = this._parseJwt(this.token ?? '');
    const blitzUser: BlitzUserProfile = {} as BlitzUserProfile;
    if (Object.keys(parsedToken).length) {
      blitzUser.email = parsedToken.email;
      blitzUser.lastName = parsedToken.family_name;
      blitzUser.firstName = parsedToken.given_name;
      blitzUser.middleName = parsedToken.middle_name ?? '';
      blitzUser.id = parsedToken.sub;
      blitzUser.phone = parsedToken.phone_number;
    }

    return blitzUser;
  }

  /**
   * Парсинг access_token
   */
  private _parseJwt(token: string): Record<string, any> {
    if (token.split('.').length !== 3) {
      return {};
    }

    let jsonPayload;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch (error) {
      return {};
    }

    return JSON.parse(jsonPayload);
  }

  /**
   * Очищение токенов и переменных
   */
  private _clearData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.authenticated = false;
    this.token = null;
  }

  /**
   * Обновление токенов и переменных
   */
  private _updateData(oAuthToken: OAuthToken): void {
    // alert(123);
    localStorage.setItem('accessToken', oAuthToken.accessToken);
    localStorage.setItem('refreshToken', oAuthToken.refreshToken);
    localStorage.setItem('idToken', oAuthToken.idToken);
    this.refToken = oAuthToken.refreshToken;
    this.token = oAuthToken.accessToken;
    this.tokenParsed = this._parseJwt(this.token);
    this.authenticated = true;
  }

  /**
   * POST запрос без заголовка Authorization
   */
  private async _httpPost<T>(url: string, payload: Payload = {}): Promise<T> {
    let response: any;
    let data: T;
    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) });
    } finally {
      if (response && response.status == 400) {
        const err = await response.json();
        const errMessage = JSON.parse(err.message);
        console.error(`${errMessage.error}: ${errMessage.error_description}`);
        throw { response, err, errMessage };
      }
      if (response && ((response.status >= 200 && response.status < 300) || response.status == 409 || response.status == 404)) {
        data = await response.json();
      } else {
        throw response;
      }
    }
    return data;
  }
}

export { EpcsOAuthClient };
