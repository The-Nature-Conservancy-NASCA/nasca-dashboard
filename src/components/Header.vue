<template>
  <div class="header">
    <img src="../assets/images/tnc-logo.svg" alt="logo" class="header__logo" />
    <div class="header__estrategias">
      <select @change="cambiarEstrategia" v-model="estrategiaSelected">
        <option
          v-for="estrategia in estrategias"
          :key="estrategia.id"
          :value="estrategia.id"
          >{{ estrategia.nombre }}</option
        >
      </select>
      <select @change="cambiarProyecto" v-model="proyectoSelected">
        <option
          v-for="proyecto in proyectos"
          :key="proyecto.id"
          :value="proyecto.id"
          >{{ proyecto.nombre }}</option
        >
      </select>
      <button @click="seleccionarTodo">Ver todo</button>
      <DownloadDataBtn />
      <DownloadImageBtn />
    </div>
  </div>
</template>

<script>
import DownloadDataBtn from "./DownloadDataBtn.vue";
import DownloadImageBtn from "./DownloadImageBtn.vue";

export default {
  name: "Header",
  components: {
    DownloadDataBtn,
    DownloadImageBtn
  },
  data() {
    return {
      estrategiaSelected: "",
      proyectoSelected: ""
    };
  },
  computed: {
    estrategias() {
      return this.$store.getters.estrategias;
    },
    proyectos() {
      return this.$store.getters.proyectos;
    }
  },
  methods: {
    cambiarEstrategia() {
      this.$store.dispatch("cambiarEstrategia", this.estrategiaSelected);
    },
    cambiarProyecto() {
      this.$store.dispatch("cambiarProyecto", this.proyectoSelected);
    },
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
  justify-content: space-between;
  padding: 2rem;

  &__estrategias {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  &__logo {
    width: 20rem;
  }

  button {
    background-color: transparent;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 1.6rem;
    padding: 2rem 2rem 0 2rem;
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
}
</style>
