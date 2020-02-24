<template>
  <section class="pie-chart">
    <QuantityText :name="group" :value="count" :valueSize="quantityValueSize" />
    <div ref="graph" class="graph__container"></div>
    <div v-if="icono">
      <img class="pie-chart__icon" :src="icono" alt="" />
    </div>
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
      required: true
    },
    icono: {
      type: String,
      required: false
    },
    valueLabel: {
      type: String,
      required: true
    },
    quantityValueSize: {
      type: String,
      required: false,
      default: "3"
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
      this.color = d3.scaleOrdinal(d3.schemeCategory10);
      this.tooltipOffset = 15;
      const svg = this.el
        .append("svg")
        .attr("class", "pie graph")
        .attr("id", this.graphId)
        .attr("width", this.width)
        .attr("height", this.height);
      try {
        const that = this;
        const outerRadius = this.width / 2;
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
          .attr("transform", `translate(${outerRadius}, ${outerRadius})`);
        arcs
          .append("path")
          .on("mouseover", function(d) {
            svg.selectAll("g.arc path")
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

  @media screen and (max-height: 768px) {
    width: 8rem;
    height: 8rem;
    margin: 1rem auto;
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

  &__icon {
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, calc(-50% + 27px));
    width: 10rem;

    @media screen and (min-width: 901px) and (max-width: 1280px) {
      width: 8rem;
    }

    @media screen and (max-height: 768px) {
      width: 7rem;
    }
  }
}
</style>
