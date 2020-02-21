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
  computed: {
    boxes() {
      return this.$store.state.boxes;
    }
  }
};
</script>
<style lang="scss" scoped>
.box-container {
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: 31.5vw 31.5vw 31.5vw;
  grid-auto-rows: 27.5vh;
  margin: 0 2rem 2rem 2rem;

  @media screen and (max-width: 900px) {
    display: flex;
    flex-direction: column;

    .box {
      height: 50vh;
      margin-bottom: 1rem;
    }
  }

  @media screen and (max-height: 768px) {
    grid-auto-rows: 27vh !important;
    grid-gap: 1rem;
  }
}
</style>
