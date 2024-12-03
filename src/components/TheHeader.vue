<template>
  <div class="header">
    <div class="header__content">
      <div class="logo-wrapper">
      </div>
      <div class="title">
      </div>
      <div class="controls">
        <div class="epsc-header-top-menu">
          <div class="epsc-header-top-menu-item">
            <i class="icon si-hamburger-fill" @click="showMainMenu = !showMainMenu"></i>
            <q-menu v-if="showMainMenu" class="epsc-header-popup-menu">
              <q-list>
                <template v-if="!authenticated">
                  <q-item clickable @click="store.login()">
                    <q-item-section avatar><q-icon class="menu-icon si-user" /></q-item-section>
                    <q-item-section>Логин</q-item-section>
                    <q-item-section side><i class="menu-icon-link si-login-fill"></i></q-item-section>
                  </q-item>
                  <q-separator />
                </template>
                <q-item v-if="authenticated">
                  <q-item-section avatar><q-icon class="menu-icon si-user" /></q-item-section>
                  <q-item-section>
                    <div class="epsc-header-user-name">{{ `${currentUser?.firstName} ${currentUser?.lastName}` }}</div>
                  </q-item-section>
                </q-item>
                <q-separator />
                <!-- Выход -->
                <q-separator v-if="authenticated" clickable @click="store.logout()"/>
                <q-item v-if="authenticated" clickable @click="store.logout()">
                  <q-item-section avatar><q-icon class="menu-icon si-logout" /></q-item-section>
                  <q-item-section>Выход</q-item-section>
                  <q-item-section side></q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue"
  import useAuthStore from "@/stores/auth"
  import { storeToRefs } from "pinia"
  import useAccountStore from "@/stores/account"
    
  const showMainMenu = ref(false)
  const store = useAuthStore()

  const accountStore = useAccountStore()
  const { currentUser } = storeToRefs(accountStore)
  const { authenticated } = storeToRefs(store)
</script>

<style scoped lang="scss">
  .header {
    height: var(--header-height);
    background-color: #263069;
    width: 100%;
    display: flex;
    align-items: center;

    &__content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 16px;
      height: 100%;
    }
  }

  .logo-wrapper {
    display: flex;
    align-items: center;
    justify-content: start;
    width: 200px;
    height: 100%;
  }

  .logo {
    background: var(--system-logo);
    height: 40px;
    width: 40px;
  }

  .logo-text {
    background: var(--system-logo-text);
    height: 40px;
    width: 120px;
    transform: translate(-30px, 0px);
  }

  // Анимация вращения при загрузке новой версии pwa
  .logo.isUpdating {
    animation: spin 5s linear infinite;
  }

  @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

  .title h1 {
    font-family: "Roboto Condensed", "Arial Narrow", sans-serif;
    color: white;
    font-weight: 300;
    font-size: 28px;
    letter-spacing: 0.05em;
    text-align: center;
    text-transform: uppercase;
  }

  .controls {
    width: 150px;
  }

  /* Меню в правом верхнем углу */
  .epsc-header-top-menu {
    position: relative;
    margin-right: 16px;
    color: var(--text-link-color);
    display: flex;
    flex-direction: row;
    justify-content: right;
    align-items: center;
    flex-wrap: nowrap;
  }
  .epsc-header-top-menu-item {
    position: static;
    height: 32px;
    top: calc(50% - 32px / 2);
    border: none;
    background-color: var(--header-icon-bg-color);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 0 0 0 4px;
    text-align: center;
    line-height: 32px;
    border-radius: 16px;
    text-decoration: none;
  }
  .epsc-header-top-menu-item:hover {
    color: var(--header-icon-hover-color);
    cursor: pointer;
  }
  .epsc-header-top-menu-item .icon {
    font-family: "smpiconsdemo";
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    color: var(--header-icon-color);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .epsc-header-top-menu-item:hover .icon {
    color: var(--header-icon-hover-color);
  }
  /* Выпадающие меню от кнопок в правом вехнем углу */
  .epsc-header-popup-menu {
    min-width: 360px;
  }
  .epsc-header-popup-menu .q-list {
    padding: 8px;
  }
  .epsc-header-popup-menu .q-item {
    padding: 0 4px 0 4px;
    line-height: 15px;
    background-color: var(--header-popup-menu-item-bg-color);
    color: var(--header-popup-menu-item-text-color);
    display: flex;
    align-items: center;
  }
  .epsc-header-popup-menu .q-item:hover:not([aria-disabled="true"]) {
    background-color: var(--header-popup-menu-item-bg-hover-color);
    color: var(--header-popup-menu-item-text-hover-color);
  }
  .epsc-header-popup-menu .q-item > .disabled,
  .epsc-header-popup-menu .q-item[aria-disabled="true"] {
    color: var(--header-popup-menu-item-disabled-color);
  }
  .epsc-header-popup-menu .q-item__section--avatar {
    margin-left: 4px;
    width: 32px;
    max-width: 32px;
  }
  .epsc-header-popup-menu .menu-icon {
    font-family: "smpiconsdemo";
    font-style: normal;
    font-weight: normal;
    font-size: 32px;
    color: var(--header-popup-menu-item-icon-color);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .epsc-header-popup-menu .q-item:hover:not([aria-disabled="true"]) .menu-icon {
    color: var(--header-popup-menu-item-icon-hover-color);
  }
  .epsc-header-popup-menu .q-item > .disabled .menu-icon,
  .epsc-header-popup-menu .q-item[aria-disabled="true"] .menu-icon {
    color: var(--header-popup-menu-item-disabled-color);
  }
  .epsc-header-popup-menu .q-item .menu-icon-link {
    font-family: "smpiconsdemo";
    font-style: normal;
    font-weight: normal;
    font-size: 32px;
    color: var(--text-link-color);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .epsc-header-popup-menu .q-item:hover .menu-icon-link {
    color: var(--header-popup-menu-item-icon-hover-color);
    cursor: pointer;
  }
  .epsc-header-popup-menu hr.q-separator {
    margin: 0;
    margin: 0;
  }
  .epsc-header-user-name {
    white-space: nowrap;
  }
</style>
