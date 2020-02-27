<template>
  <div class="width-100">
    <div class="cobertura" v-if="cobertura.children.length">
      <Treemap
        :graphData="cobertura"
        :graphId="'treemap__coberturas'"
        :component="'coberturas'"
      />
      <div
        v-show="this.$store.state.filtro.modo == 'proyecto'"
        class="cobertura__ctas"
      >
        <button
          :title="strings.clasificacionCorine"
          :class="buttonClass('corine')"
          @click="changeClassificationScheme('corine')"
        ></button>
        <button
          :title="strings.clasificacionProyecto"
          :class="buttonClass('project')"
          @click="changeClassificationScheme('project')"
        ></button>
      </div>
    </div>
    <div v-else class="no__data__warning">
      <p>{{ strings.noHayDatos }}</p>
    </div>
  </div>
</template>
<script>
import Treemap from "./Treemap.vue";

export default {
  name: "Cobertura",
  components: {
    Treemap
  },
  computed: {
    cobertura() {
      return this.$store.getters.coberturas;
    },
    strings() {
      return this.$store.getters.strings;
    }
  },
  data() {
    return {
      selectedScheme: "corine",
      subtitle: {
        corine: "clasificacionCorine",
        proyecto: "clasificacionProyecto"
      }
    };
  },
  methods: {
    buttonClass(schemeName) {
      return {
        selected: this.selectedScheme === schemeName,
        unselected: this.selectedScheme !== schemeName
      };
    },
    changeBoxSubtitle() {
      this.boxTitle = this.$parent.box.title;
      this.boxSubtitle = this.strings[this.subtitle[this.selectedScheme]];
      this.$store.dispatch("changeBoxSubtitle", {
        title: this.boxTitle,
        subtitle: this.boxSubtitle
      });
    },
    changeClassificationScheme(schemeName) {
      this.$store.dispatch("changeClassificationScheme", schemeName);
      this.selectedScheme = schemeName;
      this.changeBoxSubtitle();
    }
  },
  watch: {
    strings() {
      this.changeBoxSubtitle();
    }
  },
  mounted() {
    this.changeBoxSubtitle();
  }
};
</script>
<style lang="scss" scoped>
.cobertura {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 1rem;

  &__ctas {
    align-items: center;
    display: flex;
    justify-content: space-evenly;
    margin: 0 auto;
    width: 33%;

    button {
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
      background-color: #ddd;
      cursor: pointer;
      border: none;
      border-radius: 50%;
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

      &:focus {
        outline: none;
      }
    }
  }
}

.no__data__warning > p {
  text-align: center;
  font-size: 14px;
}
</style>
