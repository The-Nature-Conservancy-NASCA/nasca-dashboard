<template>
  <div class="header">
    <img src="../assets/images/tnc-logo.svg" alt="logo" class="header__logo" />
    <div class="header__estrategias">
      <FiltroEstrategia />
      <button @click="seleccionarTodo">Ver todo</button>
      <DownloadDataBtn />
      <DownloadImageBtn />
    </div>
  </div>
</template>

<script>
import DownloadDataBtn from "./DownloadDataBtn.vue";
import DownloadImageBtn from "./DownloadImageBtn.vue";
import FiltroEstrategia from "../components/FiltroEstrategia.vue";

export default {
  name: "Header",
  components: {
    DownloadDataBtn,
    DownloadImageBtn,
    FiltroEstrategia
  },
  data() {
    return {
      estrategiaSelected: "",
      proyectoSelected: ""
    };
  },
  methods: {
    seleccionarTodo() {
      this.$store.dispatch("verTodo");
    }
  }
};
</script>

<style scoped lang="scss">
.header {
  align-items: center;
  display: flex;
  justify-content: flex-start;
  padding: 2rem;

  &__estrategias {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  &__logo {
    width: 20rem;
    margin-right: 2rem;
  }

  button {
    background-color: transparent;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 1.6rem;
    padding: 2rem;
    transition: color 0.3s;

    &:hover {
      color: #666;
    }
  }

  @media screen and (min-width: 901px) and (max-width: 1280px) {
    &__logo {
      width: 15rem;
    }
  }

  @media screen and (max-height: 768px) {
    padding: 1rem 2rem;
  }
}
</style>
