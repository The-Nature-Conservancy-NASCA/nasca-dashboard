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
  watch: {
    graphData() {
      this.render();
    }
  },
  methods: {
    render() {
      this.el = d3.select(this.$refs["graph"]);
      this.el.html("");
      this.width = parseInt(this.el.style("width"));
      this.height = parseInt(this.el.style("height"));
      this.margin = 1;
      this.color = d3.scaleOrdinal(d3.schemeCategory10);
      this.tooltipOffset = 15;
      this.iconSize;
      this.fontSize;
      if (screen.height <= 768) {
        this.iconSize = "6.5rem";
        this.fontSize = "2.5rem";
      } else if (screen.width > 900 && screen.width <= 1280) {
        this.iconSize = "7.5rem";
        this.fontSize = "2.75rem";
      } else {
        this.iconSize = "9.5rem";
        this.fontSize = "3rem";
      }
      const svg = this.el
        .append("svg")
        .attr("class", "pie graph")
        .attr("id", this.graphId)
        .attr("width", this.width)
        .attr("height", this.height);
      try {
        const that = this;
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
            svg
              .selectAll("g.arc path")
              .attr("fill-opacity", 0.3)
              .attr("stroke-opacity", 0.5);
            d3.select(this)
              .attr("fill-opacity", 0.8)
              .attr("stroke-opacity", 1);
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
              .attr("fill-opacity", 0.6)
              .attr("stroke-opacity", 0.75);
            d3.select("#tooltip__graph").style("display", "none");
          })
          .attr("fill", d =>
            this.colors ? this.colors[d.data.name] : this.color(d.data.name)
          )
          .attr("stroke", d =>
            this.colors ? this.colors[d.data.name] : this.color(d.data.name)
          )
          .attr("fill-opacity", 0.6)
          .attr("stroke-opacity", 0.75)
          .attr("d", arc);
        if (this.icono) {
          const img = svg
            .append("image")
            .attr("href", this.icono)
            .attr("width", this.iconSize)
            .attr("height", this.iconSize)
            .attr("pointer-events", "none");
          const bbox = img.node().getBBox();
          img
            .attr("x", this.width / 2 - bbox.width / 2)
            .attr("y", this.height / 2 - bbox.height / 2);
        }
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
            .text(this.value.toLocaleString());
        }
      } catch (error) {
        console.log(error);
      }
    }
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
