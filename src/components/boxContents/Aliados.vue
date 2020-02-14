<template>
  <carousel
    :perPage="6"
    :paginationEnabled="false"
    :navigationEnabled="true"
    :navigationClickTargetSize="5"
    :navigationPrevLabel="'&#8249;'"
    :navigationNextLabel="'&#8250;'"
  >
    <slide v-for="contribucion in contribuciones" :key="contribucion.OBJECTID">
      <img :src="contribucion.logo" :name="contribucion.nombre" alt="" />
    </slide>
  </carousel>
</template>
<script>
import { Carousel, Slide } from "vue-carousel";
import * as d3 from "d3";

export default {
  name: "Aliados",
  components: {
    Carousel,
    Slide
  },
  computed: {
    contribuciones() {
      return this.$store.getters.contribuciones;
    }
  },
  mounted() {
    const tooltipOffset = 15;
    const imgs = d3.selectAll(".VueCarousel img");
    imgs
      .data(this.contribuciones)
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
};
</script>
<style lang="scss">
.VueCarousel {
  width: 90%;
  margin: auto;

  img {
    width: 45px;
    margin: auto;
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
</style>
