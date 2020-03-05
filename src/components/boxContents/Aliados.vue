<template>
  <div class="aliados width-100">
    <carousel
      class="carousel donantes"
      v-show="this.$store.state.filtro.allyType == '0'"
      v-bind="carouselSettings"
    >
      <slide v-for="aliado in donantes" :key="aliado.OBJECTID">
        <a :href="aliado.url" target="_blank">
          <img :src="aliado.logo" :name="aliado.nombre" alt />
        </a>
      </slide>
    </carousel>
    <carousel
      class="carousel socios"
      v-show="this.$store.state.filtro.allyType == '1'"
      v-bind="carouselSettings"
    >
      <slide v-for="aliado in socios" :key="aliado.OBJECTID">
        <a :href="aliado.url" target="_blank">
          <img :src="aliado.logo" :name="aliado.nombre" alt />
        </a>
      </slide>
    </carousel>
    <carousel
      class="carousel instituciones__implementadoras"
      v-show="this.$store.state.filtro.allyType == '2'"
      v-bind="carouselSettings"
    >
      <slide
        v-for="aliado in institucionesImplementadoras"
        :key="aliado.OBJECTID"
      >
        <a :href="aliado.url" target="_blank">
          <img :src="aliado.logo" :name="aliado.nombre" alt />
        </a>
      </slide>
    </carousel>
    <carousel
      class="carousel organizaciones__locales"
      v-show="this.$store.state.filtro.allyType == '3'"
      v-bind="carouselSettings"
    >
      <slide v-for="aliado in organizacionesLocales" :key="aliado.OBJECTID">
        <a :href="aliado.url" target="_blank">
          <img :src="aliado.logo" :name="aliado.nombre" alt />
        </a>
      </slide>
    </carousel>
    <div class="aliados__ctas">
      <button
        v-show="donantes.length"
        :title="strings.donantes"
        :class="buttonClass('0')"
        @click="changeType('0')"
      ></button>
      <button
        v-show="socios.length"
        :title="strings.socios"
        :class="buttonClass('1')"
        @click="changeType('1')"
      ></button>
      <button
        v-show="institucionesImplementadoras.length"
        :title="strings.institucionesImplementadoras"
        :class="buttonClass('2')"
        @click="changeType('2')"
      ></button>
      <button
        v-show="organizacionesLocales.length"
        :title="strings.organizacionesLocales"
        :class="buttonClass('3')"
        @click="changeType('3')"
      ></button>
    </div>
  </div>
</template>
<script>
import { Carousel, Slide } from "vue-carousel";
import * as d3 from "d3";

export default {
  name: "Aliados",
  components: { Carousel, Slide },
  computed: {
    allyType() {
      return this.$store.getters.filtro.allyType;
    },
    filtroModo() {
      return this.$store.getters.filtro.modo;
    },
    filtroValor() {
      return this.$store.getters.filtro.valor;
    },
    donantes() {
      const arr = this.$store.getters.aliados.filter(
        aliado => aliado.tipo == "0"
      );
      return this.removeDuplicates(arr, "nombre");
    },
    socios() {
      const arr = this.$store.getters.aliados.filter(
        aliado => aliado.tipo == "1"
      );
      return this.removeDuplicates(arr, "nombre");
    },
    institucionesImplementadoras() {
      const arr = this.$store.getters.aliados.filter(
        aliado => aliado.tipo == "2"
      );
      return this.removeDuplicates(arr, "nombre");
    },
    organizacionesLocales() {
      const arr = this.$store.getters.aliados.filter(
        aliado => aliado.tipo == "3"
      );
      return this.removeDuplicates(arr, "nombre");
    },
    strings() {
      return this.$store.getters.strings;
    }
  },
  data() {
    return {
      selectedType: "0",
      carouselSettings: {
        perPage: 2,
        scrollPerPage: false,
        paginationEnabled: false,
        navigationEnabled: true,
        navigationClickTargetSize: 15,
        navigationPrevLabel: "&#8249;",
        navigationNextLabel: "&#8250;"
      },
      subtitles: {
        "0": "donantes",
        "1": "socios",
        "2": "institucionesImplementadoras",
        "3": "organizacionesLocales"
      }
    };
  },
  methods: {
    buttonClass(type) {
      return {
        selected: this.selectedType === type,
        unselected: this.selectedType !== type
      };
    },
    changeBoxSubtitle() {
      this.boxTitle = this.$parent.box.title;
      this.boxSubtitle = this.strings[this.subtitles[this.selectedType]];
      this.$store.dispatch("changeBoxSubtitle", {
        title: this.boxTitle,
        subtitle: this.boxSubtitle
      });
    },
    changeType(type) {
      this.$store.dispatch("changeAllyType", type);
      this.selectedType = type;
      this.changeBoxSubtitle();
      this.fixCarouselOverflow(type);
    },
    fixCarouselOverflow(type) {
      let carouselClass;
      let items;
      if (type === "0") {
        carouselClass = "donantes";
        items = this.donantes.length;
      } else if (type === "1") {
        carouselClass = "socios";
        items = this.socios.length;
      } else if (type === "2") {
        carouselClass = "instituciones__implementadoras";
        items = this.institucionesImplementadoras.length;
      } else if (type === "3") {
        carouselClass = "organizaciones__locales";
        items = this.organizacionesLocales.length;
      }
      const carousel = this.$el.querySelector(`.carousel.${carouselClass}`);
      if (!carousel) {
        return;
      }
      if (items > this.carouselSettings.perPage) {
        carousel.querySelector(".VueCarousel-inner").style["justify-content"] =
          "normal";
      } else {
        carousel.querySelector(".VueCarousel-inner").style["justify-content"] =
          "space-evenly";
      }
    },
    removeDuplicates(myArr, prop) {
      return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
      });
    },
    setImgsTooltip(selector, data) {
      const tooltipOffset = 15;
      const imgs = d3.selectAll(selector);
      imgs
        .data(data)
        .on("mouseover", function(d) {
          imgs.style("opacity", 0.2);
          d3.select(this).style("opacity", 1);
          const tooltipContent = `<span class="tooltip__title">${d.nombre}</span>`;
          const coordinates = [d3.event.pageX, d3.event.pageY];
          d3.select("#tooltip__graph")
            .style("left", `${coordinates[0] + tooltipOffset}px`)
            .style("top", `${coordinates[1]}px`)
            .style("display", "block")
            .style("font-size", "11px")
            .html(tooltipContent);
        })
        .on("mousemove", () => {
          const coordinates = [d3.event.pageX, d3.event.pageY];
          d3.select("#tooltip__graph")
            .style("left", `${coordinates[0] + tooltipOffset}px`)
            .style("top", `${coordinates[1]}px`);
        })
        .on("mouseout", function() {
          imgs.style("opacity", 1);
          d3.select("#tooltip__graph")
            .html("")
            .style("display", "none");
        });
    }
  },
  mounted() {
    this.changeBoxSubtitle();
    this.fixCarouselOverflow("0");
    this.setImgsTooltip(".VueCarousel.donantes img", this.donantes);
    this.setImgsTooltip(".VueCarousel.socios img", this.socios);
    this.setImgsTooltip(
      ".VueCarousel.instituciones__implementadoras img",
      this.institucionesImplementadoras
    );
    this.setImgsTooltip(
      ".VueCarousel.organizaciones__locales img",
      this.organizacionesLocales
    );
  },
  watch: {
    filtroModo() {
      if (this.filtroModo === "colombia") {
        this.fixCarouselOverflow(this.contributionType);
      }
    },
    filtroValor() {
      this.fixCarouselOverflow(this.contributionType);
    },
    strings() {
      this.changeBoxSubtitle();
    }
  }
};
</script>
<style lang="scss" scoped>
.w-100 {
  width: 100%;
}

.aliados {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .donantes {
    height: 90%;
  }

  .carousel {
    flex: 1;
    display: flex;
    align-content: center;
    justify-content: center;
  }

  .VueCarousel {
    width: 80%;
    margin: auto;

    &-inner {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }

    &-navigation-button {
      font-size: 20px;
    }

    &-slide {
      text-align: center;
    }

    img {
      width: 120px;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      -moz-transition: all 0.25s;
      -o-transition: all 0.25s;
      -webkit-transition: all 0.25s;
      transition: all 0.25s;
      opacity: 1;

      @media screen and (max-height: 768px) {
        width: 80px;
      }

      @media screen and (max-width: 440px) {
        width: 115px;
      }
    }
  }

  &__ctas {
    align-items: center;
    display: flex;
    justify-content: space-evenly;
    margin: 0 auto;
    margin-bottom: 1rem;
    width: 30%;

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
      }

      &:focus {
        outline: none;
      }
    }
  }
}
</style>
