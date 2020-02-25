<template>
  <div class="aliados width-100">
    <carousel
      class="donantes"
      v-show="this.$store.state.filtro.allyType == '0'"
      v-bind="carouselSettings"
    >
      <slide v-for="aliado in donantes" :key="aliado.OBJECTID">
        <a :href="aliado.url" target="_blank">
          <img :src="aliado.logo" :name="aliado.nombre" alt="" />
        </a>
      </slide>
    </carousel>
    <carousel
      class="socios"
      v-show="this.$store.state.filtro.allyType == '1'"
      v-bind="carouselSettings"
    >
      <slide v-for="aliado in socios" :key="aliado.OBJECTID">
        <a :href="aliado.url" target="_blank">
          <img :src="aliado.logo" :name="aliado.nombre" alt="" />
        </a>
      </slide>
    </carousel>
    <carousel
      class="instituciones__implementadoras"
      v-show="this.$store.state.filtro.allyType == '2'"
      v-bind="carouselSettings"
    >
      <slide
        v-for="aliado in institucionesImplementadoras"
        :key="aliado.OBJECTID"
      >
        <a :href="aliado.url" target="_blank">
          <img :src="aliado.logo" :name="aliado.nombre" alt="" />
        </a>
      </slide>
    </carousel>
    <carousel
      class="organizaciones__locales"
      v-show="this.$store.state.filtro.allyType == '3'"
      v-bind="carouselSettings"
    >
      <slide v-for="aliado in organizacionesLocales" :key="aliado.OBJECTID">
        <a :href="aliado.url" target="_blank">
          <img :src="aliado.logo" :name="aliado.nombre" alt="" />
        </a>
      </slide>
    </carousel>
    <div class="aliados__ctas">
      <button
        v-show="donantes.length"
        data-tippy-content="Donantes"
        :class="buttonClass('0')"
        @click="changeType('0', $event)"
      ></button>
      <button
        v-show="socios.length"
        data-tippy-content="Socios"
        :class="buttonClass('1')"
        @click="changeType('1', $event)"
      ></button>
      <button
        v-show="institucionesImplementadoras.length"
        data-tippy-content="Instituciones implementadoras"
        :class="buttonClass('2')"
        @click="changeType('2', $event)"
      ></button>
      <button
        v-show="organizacionesLocales.length"
        data-tippy-content="Organizaciones locales"
        :class="buttonClass('3')"
        @click="changeType('3', $event)"
      ></button>
    </div>
  </div>
</template>
<script>
import { Carousel, Slide } from "vue-carousel";
import * as d3 from "d3";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

export default {
  name: "Aliados",
  components: { Carousel, Slide },
  computed: {
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
      this.boxSubtitle = this.btn.getAttribute("data-tippy-content");
      this.$store.dispatch("changeBoxSubtitle", {
        title: this.boxTitle,
        subtitle: this.boxSubtitle
      });
    },
    changeType(type, event) {
      this.$store.dispatch("changeAllyType", type);
      this.selectedType = type;
      this.btn = event.target;
      this.changeBoxSubtitle();
      this.fixCarouselOverflow(type);
    },
    fixCarouselOverflow(type) {
      let carouselClass;
      if (type === "0") {
        carouselClass = "donantes";
      } else if (type === "1") {
        carouselClass = "socios";
      } else if (type === "2") {
        carouselClass = "instituciones__implementadoras";
      } else if (type === "3") {
        carouselClass = "organizaciones__locales";
      }
      const carousel = this.$el.querySelector(`.VueCarousel.${carouselClass}`);
      if (carousel.querySelector(".VueCarousel-navigation")) {
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
    this.btn = this.$el.querySelector(".aliados__ctas button.selected");
    this.changeBoxSubtitle();
    this.fixCarouselOverflow("0");
    tippy("[data-tippy-content]", {
      placement: "bottom"
    });
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
  }
};
</script>
<style lang="scss" scoped>
.aliados {
  .donantes {
    height: 90%;
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
      // height: 100px;
      width: 120px;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      -moz-transition: all 0.25s;
      -o-transition: all 0.25s;
      -webkit-transition: all 0.25s;
      transition: all 0.25s;
      opacity: 1;
    }
  }

  &__ctas {
    align-items: center;
    display: flex;
    justify-content: space-evenly;
    margin: 0 auto;
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
