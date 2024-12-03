import { defineStore } from 'pinia';
import type { EPCSUser } from '@/modules/greenatomTypes';
import type { AccountOrganization } from '@/modules/greenatomTypes';
import type { ServerResponse } from '@/modules/greenatomTypes';

const store = defineStore('account', {
  state: () => {
    return {
      currentUser: <EPCSUser | null>null,
      organization: <AccountOrganization | null>null,
    };
  },
  actions: {
    async getCurrentUser() {
      if (this.currentUser) {
        return this.currentUser;
      }
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const response = <ServerResponse<EPCSUser>>await this.http.httpGet('/api/auth/suser/current');
        this.currentUser = response.data;
        return this.currentUser;
      } catch (e: any) {
        return this.handleError(e);
      }
    },
    handleError(e: any) {
      // Notify.create({ type: 'negative', message: `${e.status} ${e.statusText ?? e.message}` });
      console.error('account.ts error', e)
      throw { status: e.status, statusText: e.statusText };
    },
    showErrorMessage(response: ServerResponse<any>) {
      if (!response.success) {
        console.error('showErrorMessage account ts', response);
        // Notify.create({ type: 'negative', message: response.code ? response.code.toString() : '' });
      }
    },
  },
});

export default store;
