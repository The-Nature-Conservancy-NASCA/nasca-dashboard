<template>
  <div v-if="carbono.data.length" class="carbono">
    <div class="carbono__ctas">
      <button :class="buttonClass(null)" @click="changeField(null)">
        Total
      </button>
      <button
        :class="buttonClass('compartimiento')"
        @click="changeField('compartimiento')"
      >
        Compartimiento
      </button>
      <button
        :class="buttonClass('cobertura')"
        v-if="this.$store.getters.filtro.modo === 'proyecto'"
        @click="changeField('cobertura')"
      >
        Cobertura
      </button>
      <button
        :class="buttonClass('snc')"
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
  data() {
    return {
      selectedField: null
    };
  },
  computed: {
    carbono() {
      return this.$store.getters.carbono;
    }
  },
  methods: {
    changeField(field) {
      this.$store.state.filtro.carbonoField = field;
      this.selectedField = field;
    },
    buttonClass(field) {
      return {
        selected: this.selectedField === field,
        unselected: this.selectedField !== field
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.carbono {
  &__ctas {
    align-items: center;
    display: flex;
    justify-content: space-evenly;
    width: 100%;

    button {
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
      background-color: #ddd;
      cursor: pointer;
      border: none;
      padding: 1rem;
      transition: all 0.2s;

      &.selected {
        background-color: var(--color-green-tnc);
        color: #fff;
      }

      &:hover {
        box-shadow: 0 5px 8px rgba(0, 0, 0, 0.4);
        transform: translateY(-2px);
      }
    }
  }
}
</style>
