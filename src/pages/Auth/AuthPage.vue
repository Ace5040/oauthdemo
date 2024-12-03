<script setup lang="ts">
import { useRouter } from 'vue-router';
import useAuthStore from '@/stores/auth';
const router = useRouter();
const auth = useAuthStore();

if (!auth.authenticated) {
  auth.login();
} else if (window.top?.opener !== null) {
  const event = new Event('authenticated');
  window.top?.opener.window.dispatchEvent(event);
} else {
  router.push('/pwa/gis');
}

</script>
