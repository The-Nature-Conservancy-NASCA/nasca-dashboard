<template>
  <div class="width-100">
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
          <QuantityText
            :name="item.name"
            :value="item.value"
            :unit="'GtCO2e'"
          />
        </div>
      </div>
      <div class="carbono__ctas">
        <button
          :title="strings.fijacionTotal"
          :class="buttonClass('total')"
          @click="changeField('total', $event)"
        ></button>
        <button
          :title="strings.fijacionCompartimiento"
          :class="buttonClass('compartimiento')"
          @click="changeField('compartimiento', $event)"
        ></button>
        <button
          :title="strings.fijacionCobertura"
          :class="buttonClass('cobertura')"
          v-show="this.$store.getters.filtro.modo === 'proyecto'"
          @click="changeField('cobertura', $event)"
        ></button>
        <button
          :title="strings.fijacionSolucion"
          :class="buttonClass('SNC')"
          v-show="this.$store.getters.filtro.modo !== 'proyecto'"
          @click="changeField('SNC', $event)"
        ></button>
      </div>
    </div>
    <div class="no__data__warning" v-else>
      <p>Todavía no hay datos :(</p>
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
      selectedField: "total",
      subtitles: {
        total: "fijacionTotal",
        compartimiento: "fijacionCompartimiento",
        cobertura: "fijacionCobertura",
        SNC: "fijacionSolucion"
      }
    };
  },
  computed: {
    carbono() {
      return this.$store.getters.carbono;
    },
    carbonoProyecto() {
      return this.$store.getters.carbonoPorProyecto;
    },
    mode() {
      return this.$store.getters.filtro.modo;
    },
    strings() {
      return this.$store.getters.strings;
    }
  },
  methods: {
    buttonClass(field) {
      return {
        selected: this.selectedField === field,
        unselected: this.selectedField !== field
      };
    },
    changeBoxSubtitle() {
      this.boxTitle = this.$parent.box.title;
      this.boxSubtitle = this.strings[this.subtitles[this.selectedField]];
      this.$store.dispatch("changeBoxSubtitle", {
        title: this.boxTitle,
        subtitle: this.boxSubtitle
      });
    },
    changeField(field, event) {
      this.$store.dispatch("changeCarbonoField", field);
      this.selectedField = field;
      this.btn = event.target;
      this.changeBoxSubtitle();
    },
    resetFieldAndBoxSubtitle() {
      this.$store.dispatch("changeCarbonoField", "total");
      this.selectedField = "total";
      this.btn = this.$el.querySelector(".carbono__ctas button");
      this.changeBoxSubtitle();
    }
  },
  mounted() {
    this.btn = this.$el.querySelector(".carbono__ctas button.selected");
    this.changeBoxSubtitle();
  },
  watch: {
    mode() {
      this.resetFieldAndBoxSubtitle();
    },
    strings() {
      this.changeBoxSubtitle();
    }
  }
};
</script>
<style lang="scss" scoped>
.carbono {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 1rem;

  &__ctas {
    align-items: center;
    display: flex;
    justify-content: space-between;
    width: 15%;

    button {
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
      background-color: #ddd;
      cursor: pointer;
      border: none;
      border-radius: 50%;
      padding: 0.5rem;
      transition: all 0.2s;

      &.selected {
        background-color: var(--theme-color);
        color: #fff;
      }

      &:hover {
        box-shadow: 0 5px 8px rgba(0, 0, 0, 0.4);
      }

      &:focus {
        outline: none;
      }
    }
  }

  &__numbers {
    margin-top: 3rem;
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
  }
}

.no__data__warning > p {
  text-align: center;
  font-size: 14px;
}
</style>
