<template>
  <v-app id="app">
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/stylesheets/master.scss";

::-webkit-scrollbar {
  width: 7px;
}
::-webkit-scrollbar-track {
  background: $white;
}
::-webkit-scrollbar-thumb {
  background: $main;
  border-radius: 5px;
}

html,
body {
  padding: 0 !important;
  margin: 0 !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden !important;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#app {
  background-color: #f5f5f5;
  padding: 0 !important;
  margin: 0 !important;
  height: 100vh;
  font-family: "Roboto";
}
.grecaptcha-badge {
  visibility: hidden;
}
</style>
