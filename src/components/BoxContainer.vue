<template>
  <main class="box-container">
    <Box v-for="(box, i) in boxes" :key="i" :box="box" />
  </main>
</template>
<script>
import Box from "./Box.vue";

export default {
  name: "BoxContainer",
  components: {
    Box
  },
  data() {
    return {
      boxes: [
        {
          title: "Cobertura",
          position: {
            x: 1,
            y: 1
          }
        },
        {
          title: "Biodiversidad",
          position: {
            x: 1,
            y: 2
          },
          rowSpan: 2
        },
        {
          title: "Carbono",
          position: {
            x: 2,
            y: 1
          }
        },
        {
          title: "Implementación",
          position: {
            x: 3,
            y: 1
          },
          colSpan: 2
        },
        {
          title: "Metas",
          position: {
            x: 4,
            y: 1
          }
        },
        {
          title: "Participantes",
          position: {
            x: 4,
            y: 2
          }
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.box-container {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 1fr 1fr;
}
</style>
