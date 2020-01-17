<template>
  <div class="header">
    <img src="../assets/images/tnc-logo.svg" alt="logo" width="200" />
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
      <span>Viendo: {{ estrategiaSelected }}</span>
      <button @click="seleccionarTodo">Ver todo</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
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
      console.log("nueva estrategia: ", this.estrategiaSelected);
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
  padding: 1rem;
}
</style>
