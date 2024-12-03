<script setup lang="ts">
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import useAuthStore from '@/stores/auth';

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();
defineEmits([...useDialogPluginComponent.emits]);
const authStore = useAuthStore();
const isEmployee = ref<boolean>(false)

const choose = () => {
  authStore.setBlitzServer(isEmployee.value?'internal':'public');
  const authWindow = window.open('/demo/login', '_blank');
  const authHandler = async () => {
    window.removeEventListener('authenticated', authHandler);
    const isLogged = await authStore.authenticate();
    if (isLogged) {
      authWindow?.close();
    }
    onDialogOK();
  };
  window.addEventListener('authenticated', authHandler);  
};

const onCancelClick = async () => {
  onDialogCancel();
};

</script>

<template>
  <q-dialog 
    ref="dialogRef" 
    :no-route-dismiss="false" 
    :no-backdrop-dismiss="true" 
    :no-esc-dismiss="true" 
  >
    <q-card class="q-dialog-plugin">
      <q-bar class="q-pl-md q-pr-sm" dense>
        <div class="dialog-title">Требуется авторизация! Выберите тип пользователя</div>
        <q-space />
        <q-btn dense class="icon" icon="img:data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z'/%3E%3C/svg%3E" @click="onCancelClick" />
      </q-bar>
      <q-card-section class="q-pa-lg">
        <q-form>
          <q-radio v-model="isEmployee" :val="false" label="Пользователь" />
          <q-radio v-model="isEmployee" :val="true" label="Сотрудник компании" />
        </q-form>
      </q-card-section>
      <q-card-actions class="q-pt-none q-pb-lg q-pr-lg q-pl-lg" align="right">
        <q-btn label="Войти" @click="choose" highlighted />
        <q-btn label="Отмена" @click="onCancelClick"/>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<style scoped lang="scss">
.reset-btn {
  width: 100% !important;
  height: 100px !important;
}
</style>
