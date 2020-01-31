<template>
  <div v-if="carbono.data.length">
    <div>
      <button @click="changeField(null)">Total</button>
      <button @click="changeField('compartimiento')">Compartimiento</button>
      <button
        v-if="this.$store.getters.filtro.modo === 'proyecto'"
        @click="changeField('cobertura')"
      >
        Cobertura
      </button>
      <button
        v-if="this.$store.getters.filtro.modo !== 'proyecto'"
        @click="changeField('snc')"
      >
        SNC
      </button>
    </div>
    <StackedArea :graphData="carbono" :graphId="'areachart__carbono'" />
  </div>
</template>
<script>
import StackedArea from "./StackedArea.vue";

export default {
  name: "Carbono",
  components: {
    StackedArea
  },
  computed: {
    carbono() {
      return this.$store.getters.carbono;
    }
  },
  methods: {
    changeField(field) {
      this.$store.state.filtro.carbonoField = field;
    }
  }
};
</script>
