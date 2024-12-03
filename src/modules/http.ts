import type { Pinia, PiniaPluginContext } from 'pinia';
import type { Ref, createApp } from 'vue';
import 'pinia';
import { HTTP } from './client-http';
import { EpcsOAuthClient } from './client';

const blitz = new EpcsOAuthClient({
  clientId: 'polaris',
  server: `${window.location.protocol}//${window.location.host}`,
});

blitz.setBlitzServer('public')
const blitzServer = localStorage.getItem('blitzServer');
if (blitzServer === 'public' || blitzServer === 'internal') {
  blitz.setBlitzServer(blitzServer);
}

declare module 'pinia' {
  export interface PiniaCustomProperties {

    set http(value: HTTP | Ref<HTTP>);

    get http(): HTTP;

    set authClient(value: EpcsOAuthClient);

    get authClient(): EpcsOAuthClient;
  }
}

export function useHttp(app: ReturnType<typeof createApp>, pinia: Pinia) {
  app.config.globalProperties.$authClient = blitz;
  pinia.use((context: PiniaPluginContext) => {
    context.store.http = new HTTP(blitz);
    context.store.authClient = blitz;
  });
}