<template>
  <div class="biodiversidad">
    <span v-if="biodiversidad.length">
      <carousel class="carousel biodiversidad" v-bind="carouselSettings">
        <slide v-for="group in biodiversidad" :key="group.name">
          <PieChart
            :graphData="group.data"
            :icono="icono(group.name)"
            :group="group.name"
            :count="group.data.reduce((a, b) => +a + +b.value, 0)"
            :graphId="`piechart__biodiversidad__${group.name}`"
            :valueLabel="strings.especies"
          />
        </slide>
      </carousel>
    </span>
    <div v-else class="no__data__warning">
      <p>{{ strings.noHayDatos }}</p>
    </div>
  </div>
</template>
<script>
import { Carousel, Slide } from "vue-carousel";
import PieChart from "./PieChart.vue";

export default {
  name: "Biodiversidad",
  components: {
    Carousel,
    PieChart,
    Slide
  },
  computed: {
    biodiversidad() {
      return this.$store.getters.biodiversidad;
    },
    filtroModo() {
      return this.$store.getters.filtro.modo;
    },
    filtroValor() {
      return this.$store.getters.filtro.valor;
    },
    strings() {
      return this.$store.getters.strings;
    }
  },
  data() {
    return {
      carouselSettings: {
        perPage: 3,
        scrollPerPage: false,
        paginationEnabled: false,
        navigationEnabled: true,
        navigationClickTargetSize: 15,
        navigationPrevLabel: "&#8249;",
        navigationNextLabel: "&#8250;"
      }
    };
  },
  methods: {
    buttonClass(year) {
      return {
        selected: this.selectedYear === year,
        unselected: this.selectedYear !== year
      };
    },
    changeYear(year) {
      this.$store.dispatch("changeYear", {
        year: year,
        component: "biodiversidad"
      });
    },
    fixCarouselOverflow() {
      const items = this.biodiversidad.length;
      const carousel = this.$el.querySelector(".carousel.biodiversidad");
      if (!carousel) {
        return;
      }
      if (items > this.carouselSettings.perPage) {
        carousel.querySelector(".VueCarousel-inner").style["justify-content"] =
          "normal";
      } else {
        carousel.querySelector(".VueCarousel-inner").style["justify-content"] =
          "center";
      }
    },
    icono(group) {
      return this.$store.getters.biodiversityIcon(group);
    }
  },
  mounted() {
    this.fixCarouselOverflow();
  },
  beforeMount() {
    this.years;
  },
  watch: {
    filtroModo() {
      if (this.filtroModo === "colombia") {
        this.fixCarouselOverflow();
      }
    },
    filtroValor() {
      this.fixCarouselOverflow();
    },
  }
};
</script>

<style lang="scss">
.biodiversidad,
.biodiversidad > span {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;

  .carousel {
    // flex: 1;
    // display: flex;
    // align-content: center;
    // justify-content: center;
  }

  .VueCarousel {
    width: 80%;
    margin: auto;

    &-inner {
      justify-content: center;
    }

    &-navigation-button {
      font-size: 20px;
    }
  }

  &__buttons {
    transform: translateY(-3.5rem);
  }

  &__year-buttons {
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
        background-color: var(--theme-color);
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
