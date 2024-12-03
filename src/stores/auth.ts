import { defineStore } from 'pinia';
import { Dialog } from 'quasar';
import AuthDialog from '@/pages/Auth/AuthDialog.vue';
export default defineStore('auth', {
  state: () => {
    return {
      loading: false,
      userInfo: '',
      userID: '',
      authenticated: false,
      authDialogActive: false,
      permissions: [],
      logoutBtnClicked: false,
      lcIinitDone: false,
      blitzServer: <'internal' | 'public' | null>null,
    };
  },
  actions: {
    async authenticate() {
      if (!this.authenticated) {
        try {
          const code = this.getCodeFromURLParams();
          await this.authClient.init({
            code,
            redirectUri: `${window.location.origin}${window.location.pathname}`
          });
        } catch (error) {
          console.log('init failed', error);
          throw new Error("init failed");
        }
      }
      this.authenticated = this.authClient.authenticated;
      return this.authenticated;
    },
    getCodeFromURLParams(): string | null {
      const urlParams = new URLSearchParams(document.location.search);
      return urlParams.get('code');
    },
    getAuthClient() {
      return this.authClient;
    },
    isClientAuthenticated() {
      return this.authClient.authenticated;
    },
    setBlitzServer(blitzServer: 'internal' | 'public') {
      this.authClient.setBlitzServer(blitzServer);
      localStorage.setItem('blitzServer', blitzServer);
    },
    removeBlitzServer() {
      this.blitzServer = null;
      localStorage.removeItem('blitzServer');
    },
    getBlitzServer() {
      this.blitzServer = localStorage.getItem('blitzServer') as 'public' | 'internal' | null;
      return this.blitzServer;
    },

    async getPermissions(componentNames?: string[]) {
      if (this.permissions && this.authClient.token) {
        try {
          const info = await this.http.httpGet('/api/interface-management/user/permissions', 'json');
          if (info.data && info.data.content) {
            // TODO: вернуть фильтр когда будут готовы роли и полномочия в базе
            // permissions = info.data.permissions.filter((p: any) => componentNames === undefined || componentNames.includes(p.componentName));
            this.permissions = info.data.content;
          }
        } catch (e: any) {
          // this.inProgress = false;
          return this.handleError(e);
        }
        if (!this.lcIinitDone) {
          this.lcIinitDone = true;
          try {
            const permissionsPlain = this.permissions.filter((p: any) => p.allow).map((p: any) => p.resourceCode);
            //@ts-ignore
            this.layerController.setPermissions(this.getPermissionsPlain(permissionsPlain));
            console.log('Successfully set permissions for layerController')
          } catch (e: any) {
            // this.inProgress = false;
            console.log('Failed to set permissions for layerController')
          }
        }
      }
      return this.permissions;
    },

    async getPermissionsPlain(componentNames?: string[]) {
      const permissions = await this.getPermissions(componentNames);
      const permissionsPlain = permissions.filter((p: any) => p.allow).map((p: any) => p.resourceCode);
      return permissionsPlain;
    },
    async getTheme() {
      return 'default';
    },
    showAuthDialog() {
      return new Promise<boolean>((resolve, reject) => {
        if (!this.authDialogActive) {
          this.authenticated = false;
          this.authDialogActive = true;
          Dialog.create({
            component: AuthDialog,
          })
            .onOk(() => {
              resolve(true);
            })
            .onCancel(() => {
              this.authDialogActive = false;
              reject(false);
            });
        }
      });
    },
    async login() {
      const url = await this.authClient.createLoginUrl(`${window.location.origin}${window.location.pathname}`);
      location.assign(url);
    },
    async register() {
      const url = await this.authClient.createRegisterUrl(`${window.location.origin}${window.location.pathname}`);
      location.assign(url);
    },
    async logout(logoutBtnClicked = false) {
      this.removeBlitzServer();
      this.logoutBtnClicked = logoutBtnClicked;
      document.location = this.authClient.logout(window.location.origin);
    },
    handleError(e: any) {
      // Notify.create({ type: 'negative', message: `${e.status} ${e.statusText ?? e.message}` });
      console.error('auth.ts error', e);
      throw { status: e.status, statusText: e.statusText };
    },
  },
});
