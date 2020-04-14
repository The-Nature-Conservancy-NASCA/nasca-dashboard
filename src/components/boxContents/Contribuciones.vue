<template>
  <div class="contribuciones width-100">
    <i class="box__icon esri-icon-description" @click="showModal()"></i>
    <span class="width-100" v-if="hayDatos">
      <carousel
        ref="carousel__shared__conservation__agenda"
        class="carousel shared__conservation__agenda"
        v-show="this.$store.state.filtro.contributionType == '0'"
        v-bind="carouselSettings"
      >
        <slide
          v-for="contribution in SCAContributions"
          :key="contribution.OBJECTID"
        >
          <a :href="contribution.url" target="_blank">
            <img :src="contribution.logo" :name="contribution.nombre" alt="" />
          </a>
        </slide>
      </carousel>
      <carousel
        ref="carousel__otras__contribuciones"
        class="carousel otras__contribuciones"
        v-show="this.$store.state.filtro.contributionType == '1'"
        v-bind="carouselSettings"
      >
        <slide
          v-for="contribution in otherContributions"
          :key="contribution.OBJECTID"
        >
          <a :href="contribution.url" target="_blank">
            <img :src="contribution.logo" :name="contribution.nombre" alt="" />
          </a>
        </slide>
      </carousel>
      <div class="contribuciones__ctas">
        <button
          v-show="SCAContributions.length"
          :title="strings.contribucionesShared"
          :class="buttonClass('0')"
          @click="changeType('0')"
        ></button>
        <button
          v-show="otherContributions.length"
          :title="strings.contribucionesOtras"
          :class="buttonClass('1')"
          @click="changeType('1')"
        ></button>
      </div>
    </span>
    <div v-else class="no__data__warning">
      <p>{{ strings.noHayDatos }}</p>
    </div>
  </div>
</template>
<script>
import { Carousel, Slide } from "vue-carousel";
import * as d3 from "d3";

export default {
  name: "Contribuciones",
  components: {
    Carousel,
    Slide
  },
  computed: {
    contributionType() {
      return this.$store.getters.filtro.contributionType;
    },
    filtroModo() {
      return this.$store.getters.filtro.modo;
    },
    filtroValor() {
      return this.$store.getters.filtro.valor;
    },
    SCAContributions() {
      const arr = this.$store.getters.contribuciones.filter(
        contribution => contribution.tipo == "0"
      );
      return this.removeDuplicates(arr, "nombre");
    },
    otherContributions() {
      const arr = this.$store.getters.contribuciones.filter(
        contribution => contribution.tipo == "1"
      );
      return this.removeDuplicates(arr, "nombre");
    },
    hayDatos() {
      return (
        this.SCAContributions.length + this.otherContributions.length !== 0
      );
    },
    strings() {
      return this.$store.getters.strings;
    }
  },
  data() {
    let itemsPerPage;
    if (screen.width <= 768) {
      itemsPerPage = 3;
    } else {
      itemsPerPage = 5;
    }
    return {
      selectedType: "0",
      carouselSettings: {
        perPage: itemsPerPage,
        scrollPerPage: false,
        paginationEnabled: false,
        navigationEnabled: true,
        navigationClickTargetSize: 15,
        navigationPrevLabel: "&#8249;",
        navigationNextLabel: "&#8250;"
      },
      subtitles: {
        "0": "contribucionesShared",
        "1": "contribucionesOtras"
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
      this.$store.dispatch("changeContributionType", type);
      this.selectedType = type;
      this.changeBoxSubtitle();
      this.fixCarouselOverflow(type);
    },
    fixCarouselOverflow(type) {
      let carouselClass;
      let items;
      if (type === "0") {
        carouselClass = "shared__conservation__agenda";
        items = this.SCAContributions.length;
      } else if (type === "1") {
        carouselClass = "otras__contribuciones";
        items = this.otherContributions.length;
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
    },
    showModal() {
      const modalContent = {
        header: this.$parent.box.title,
        content: this.$store.getters.panelDescription(
          this.$options.name.toLocaleLowerCase()
        )
      };
      this.$store.dispatch("showModal", modalContent);
    }
  },
  mounted() {
    this.changeBoxSubtitle();
    this.setImgsTooltip(
      ".carousel.shared__conservation__agenda img",
      this.SCAContributions
    );
    this.setImgsTooltip(
      ".carousel.otras__contribuciones img",
      this.otherContributions
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
    SCAContributions() {
      this.$nextTick(function() {
        this.setImgsTooltip(
          ".carousel.shared__conservation__agenda img",
          this.SCAContributions
        );
      });
    },
    otherContributions() {
      this.$nextTick(function() {
        this.setImgsTooltip(
          ".carousel.otras__contribuciones img",
          this.otherContributions
        );
      });
    },
    strings() {
      this.changeBoxSubtitle();
    }
  }
};
</script>
<style lang="scss">
.contribuciones,
.contribuciones > span {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

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
      justify-content: space-evenly;
    }

    img {
      height: 50px;
      -moz-transition: all 0.25s;
      -o-transition: all 0.25s;
      -webkit-transition: all 0.25s;
      transition: all 0.25s;
      opacity: 1;

      @media screen and (max-width: 1023px) {
        height: 100px;
      }

      @media screen and (max-width: 440px) {
        height: 65px;
      }
    }

    .VueCarousel-slide {
      text-align: center;
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
}

.VueCarousel-navigation-button {
  font-size: 40px;
}
</style>
