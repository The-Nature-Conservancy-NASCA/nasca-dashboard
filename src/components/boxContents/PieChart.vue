<template>
  <section class="pie-chart">
    <QuantityText
      v-if="showQuantity"
      :name="group"
      :value="count"
      valueSize="2.5"
    />
    <div ref="graph" class="graph__container"></div>
  </section>
</template>
<script>
import QuantityText from "./QuantityText.vue";
import * as d3 from "d3";

export default {
  name: "PieChart",
  props: {
    colors: {
      type: Object,
      required: false
    },
    count: {
      type: Number,
      required: false
    },
    graphData: {
      type: Array,
      required: true
    },
    graphId: {
      type: String,
      required: true
    },
    group: {
      type: String,
      required: false
    },
    icono: {
      type: String,
      required: false
    },
    showQuantity: {
      type: Boolean,
      required: false,
      default: true
    },
    value: {
      required: false
    },
    valueLabel: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      el: null,
      margin: null,
      width: 0,
      height: 0,
      color: null
    };
  },
  components: {
    QuantityText
  },
  computed: {
    strings() {
      return this.$store.getters.strings;
    }
  },
  watch: {
    graphData() {
      this.render();
    },
    strings() {
      this.render();
    }
  },
  methods: {
    render() {
      this.el = d3.select(this.$refs["graph"]);
      this.el.html("");
      this.width = parseInt(this.el.style("width"));
      this.height = parseInt(this.el.style("height"));
      this.margin = 4;
      this.color = d3.scaleOrdinal(d3.schemeCategory10);
      this.tooltipOffset = 15;
      this.iconSize;
      this.fontSize;
      if (screen.width <= 440) {
        this.iconSize = "7.5rem";
        this.fontSize = "2.5rem";
      } else if (screen.width <= 768) {
        this.iconSize = "6rem";
        this.fontSize = "2rem";
      } else if (screen.width <= 900) {
        this.iconSize = "6rem";
        this.fontSize = "1.75rem";
      } else if (screen.width > 900 && screen.width <= 1280) {
        this.iconSize = "6rem";
        this.fontSize = "2.75rem";
      } else {
        this.iconSize = "6rem";
        this.fontSize = "2rem";
      }

      if (screen.height <= 768) {
        this.iconSize = "6rem";
        this.fontSize = "1.75rem";
      }
      const svg = this.el
        .append("svg")
        .attr("class", "pie graph")
        .attr("id", this.graphId)
        .attr("width", this.width)
        .attr("height", this.height);
      try {
        const that = this;
        if (this.icono) {
          const foreingObject = svg
            .append("foreignObject")
            .attr("width", this.iconSize)
            .attr("height", this.iconSize)
            .attr("pointer-events", "none");
          const bbox = foreingObject.node().getBBox();
          foreingObject
            .attr("x", this.width / 2 - bbox.width / 2)
            .attr("y", this.height / 2 - bbox.height / 2);
          foreingObject
            .append("xhtml:img")
            .attr("src", this.icono)
            .style("width", "100%")
            .style("height", "100%");
        }
        const outerRadius = this.width / 2 - this.margin;
        const innerRadius = outerRadius / 1.25;
        const arc = d3
          .arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius);
        const pie = d3
          .pie()
          .value(d => d.value)
          .padAngle(0.05);
        const arcs = svg
          .selectAll("g.arc")
          .data(pie(this.graphData))
          .enter()
          .append("g")
          .attr("class", "arc")
          .attr(
            "transform",
            `translate(${this.width / 2}, ${this.height / 2})`
          );
        arcs
          .append("path")
          .on("mouseover", function(d) {
            // svg
            //   .selectAll("g.arc path")
            //   .attr("fill-opacity", 0.6)
            //   .attr("stroke-opacity", 0.7);
            const newOuterRadius = that.width / 2 - 1;
            const arcOver = d3
              .arc()
              .innerRadius(innerRadius)
              .outerRadius(newOuterRadius);
            d3.select(this)
              .attr("fill-opacity", 1)
              .transition()
              .attr("d", arcOver);
            const coordinates = [d3.event.pageX, d3.event.pageY];
            const value = Number(Math.round(d.value)).toLocaleString("en");
            const tooltipContent = `
            <span class="tooltip__title">${d.data.name}</span>
            <hr>
            <span class="tooltip__value">${value}</span><span class="tooltip__subtitle"> ${that.valueLabel}</span>
            `;
            d3.select("#tooltip__graph")
              .style("left", `${coordinates[0] + that.tooltipOffset}px`)
              .style("top", `${coordinates[1]}px`)
              .style("display", "block")
              .style("font-size", "11px")
              .html(tooltipContent);
          })
          .on("mousemove", function() {
            const coordinates = [d3.event.pageX, d3.event.pageY];
            d3.select("#tooltip__graph")
              .style("left", `${coordinates[0] + that.tooltipOffset}px`)
              .style("top", `${coordinates[1]}px`);
          })
          .on("mouseout", function() {
            svg
              .selectAll("g.arc path")
              .attr("fill-opacity", 0.8)
              .attr("stroke-opacity", 1);
            d3.select(this)
              .transition()
              .attr("d", arc);
            d3.select("#tooltip__graph").style("display", "none");
          })
          .attr("fill", d =>
            this.colors ? this.colors[d.data.name] : this.color(d.data.name)
          )
          .attr("stroke", d =>
            this.colors
              ? this.shadeColor(this.colors[d.data.name], -15)
              : this.shadeColor(this.color(d.data.name), -15)
          )
          .attr("fill-opacity", 0.8)
          .attr("stroke-opacity", 1)
          .attr("d", arc);
        if (this.value) {
          svg
            .append("text")
            .attr("class", "pie-chart__label")
            .attr("x", this.width / 2)
            .attr("y", this.height / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", "#49A942")
            .attr("font-weight", 300)
            .attr("font-size", this.fontSize)
            .text(this.value.toLocaleString("en"));
        }
      } catch (error) {
        console.log(error);
      }
    },
    shadeColor(color, percent) {
      var R = parseInt(color.substring(1, 3), 16);
      var G = parseInt(color.substring(3, 5), 16);
      var B = parseInt(color.substring(5, 7), 16);

      R = parseInt((R * (100 + percent)) / 100);
      G = parseInt((G * (100 + percent)) / 100);
      B = parseInt((B * (100 + percent)) / 100);

      R = R < 255 ? R : 255;
      G = G < 255 ? G : 255;
      B = B < 255 ? B : 255;

      var RR =
        R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
      var GG =
        G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
      var BB =
        B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

      return "#" + RR + GG + BB;
    }
  },
  created() {
    window.addEventListener("resize", this.render);
  },
  mounted() {
    this.render();
  }
};
</script>
<style lang="scss" scoped>
.graph__container {
  width: 12rem;
  height: 12rem;
  margin: 2rem auto;

  @media screen and (max-height: 900px) {
    width: 8rem !important;
    height: 8rem !important;
    margin: 1rem auto !important;
  }

  @media screen and (min-width: 901px) and (max-width: 1280px) {
    width: 10rem;
    height: 10rem;
    margin: 1rem auto;
  }

  @media screen and (max-width: 768px) {
    width: 20rem;
    height: 20rem;
  }

  @media screen and (max-width: 440px) {
    width: 10rem !important;
    height: 10rem !important;
  }
}

.graph__header {
  text-align: center;

  h4 {
    color: #666;
    font-size: 1.8rem;
    text-transform: uppercase;

    @media screen and (min-width: 901px) and (max-width: 1280px) {
      font-size: 1.6rem;
    }
  }

  h5 {
    font-size: 1.6rem;

    @media screen and (min-width: 901px) and (max-width: 1280px) {
      font-size: 1.4rem;
    }
  }
}

.pie-chart {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
