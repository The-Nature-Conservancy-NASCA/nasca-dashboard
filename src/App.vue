<template>
  <div id="app">
    <Header msg="Welcome to Your Vue.js App" />
    <BoxContainer />
  </div>
</template>

<script>
import BoxContainer from "./components/BoxContainer.vue";
import Header from "./components/Header.vue";

export default {
  name: "app",
  components: {
    Header,
    BoxContainer
  }
};
</script>

<style lang="scss">
:root {
  --color-green-tnc: #4aa241;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 62.5%;
}

body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-size: 1.4rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  background-color: rgb(228, 228, 228);
  height: 100vh;
  padding: 0 8rem;
  width: 100vw;
}
</style>
