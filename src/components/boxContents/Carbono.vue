<template>
  <div
    v-if="
      this.$store.state.filtro.modo === 'proyecto'
        ? carbonoProyecto.data.length
        : carbono.length
    "
    class="carbono"
  >
    <StackedArea
      v-if="this.$store.state.filtro.modo === 'proyecto'"
      :graphData="carbonoProyecto"
      :graphId="'areachart__carbono'"
    />
    <div
      class="carbono__numbers"
      v-if="this.$store.state.filtro.modo !== 'proyecto'"
    >
      <div v-for="item in carbono" :key="item.name">
        <QuantityText :name="`${item.name}`" :value="item.value" />
      </div>
    </div>
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
  </div>
</template>
<script>
import QuantityText from "./QuantityText.vue";
import StackedArea from "./StackedArea.vue";

export default {
  name: "Carbono",
  components: {
    QuantityText,
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
    },
    carbonoProyecto() {
      return this.$store.getters.carbonoPorProyecto;
    }
  },
  methods: {
    buttonClass(field) {
      return {
        selected: this.selectedField === field,
        unselected: this.selectedField !== field
      };
    },
    changeField(field) {
      this.$store.dispatch("changeCarbonoField", field);
      this.selectedField = field;
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
    margin: 0 auto;
    width: 75%;

    button {
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
      background-color: #ddd;
      cursor: pointer;
      border: none;
      padding: 0.5rem;
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

  &__numbers {
    margin: auto;
    margin-bottom: 4rem;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }
}
</style>
