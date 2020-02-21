<template>
  <div class="contribuciones">
    <carousel
      class="shared__conservation__agenda"
      v-show="this.$store.state.filtro.contributionType == '0'"
      :perPage="4"
      :scrollPerPage="false"
      :paginationEnabled="false"
      :navigationEnabled="true"
      :navigationClickTargetSize="5"
      :navigationPrevLabel="'&#8249;'"
      :navigationNextLabel="'&#8250;'"
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
      class="otras__contribuciones"
      v-show="this.$store.state.filtro.contributionType == '1'"
      :perPage="4"
      :paginationEnabled="false"
      :navigationEnabled="true"
      :navigationClickTargetSize="5"
      :navigationPrevLabel="'&#8249;'"
      :navigationNextLabel="'&#8250;'"
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
        data-tippy-content="Shared Conservation Agenda"
        :class="buttonClass('0')"
        @click="changeType('0', $event)"
      ></button>
      <button
        data-tippy-content="Otras contribuciones"
        :class="buttonClass('1')"
        @click="changeType('1', $event)"
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
  name: "Contribuciones",
  components: {
    Carousel,
    Slide
  },
  computed: {
    contributionType() {
      return this.$store.getters.filtro.contributionType;
    },
    SCAContributions() {
      return this.$store.getters.contribuciones.filter(
        contribution => contribution.tipo == "0"
      );
    },
    otherContributions() {
      return this.$store.getters.contribuciones.filter(
        contribution => contribution.tipo == "1"
      );
    }
  },
  data() {
    return {
      selectedType: "0"
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
      this.$store.dispatch("changeContributionType", type);
      this.selectedType = type;
      this.btn = event.target;
      this.changeBoxSubtitle();
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
    this.btn = this.$el.querySelector(".contribuciones__ctas button.selected");
    this.changeBoxSubtitle();
    tippy("[data-tippy-content]", {
      placement: "bottom"
    });
    this.setImgsTooltip(
      ".VueCarousel.shared__conservation__agenda img",
      this.SCAContributions
    );
    this.setImgsTooltip(
      ".VueCarousel.otras__contribuciones img",
      this.otherContributions
    );
  }
};
</script>
<style lang="scss">
.contribuciones {
  .VueCarousel {
    width: 90%;
    margin: auto;

    &-inner {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
    }

    .label {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    img {
      width: 50px;
      max-width: 50px;
      // margin: auto;
      -moz-transition: all 0.25s;
      -o-transition: all 0.25s;
      -webkit-transition: all 0.25s;
      transition: all 0.25s;
      opacity: 1;
    }

    .VueCarousel-navigation-button {
      font-size: 20px;
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
