<template>
  <section>
    <div>
      <button>Proyecto</button>
      <button>Corine</button>
    </div>
    <div ref="graph" class="graph__container"></div>
    <div id="tooltip__treemap" class="tooltip__graph"></div>
    <div>
      <button v-for="year in years" :key="year" @click="changeYear(year)">{{year}}</button>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.graph__container {
  width: 400px;
  height: 300px;
}
</style>
<script>
import * as d3 from "d3";

export default {
  name: "Treemap",
  props: {
    graphData: {
      type: Object,
      required: true
    }
  },
  computed: {
    years() {
      return this.graphData.years;
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
  watch: {
    graphData() {
      this.render();
    }
  },
  methods: {
    changeYear(newYear) {
      this.$store.dispatch("changeYear", newYear);
    },
    render() {
      this.el = d3.select(this.$refs["graph"]);
      this.el.html("");
      this.margin = { top: 10, right: 10, bottom: 10, left: 10 };
      this.width =
        parseInt(this.el.style("width")) - this.margin.left - this.margin.right;
      this.height =
        parseInt(this.el.style("height")) -
        this.margin.top -
        this.margin.bottom;
      this.color = d3.scaleOrdinal(d3.schemeCategory10);

      const treemapGroup = this.el
        .append("svg")
        .attr("class", "treemap")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr(
          "transform",
          `translate(${this.margin.left}, ${this.margin.top})`
        );

      const root = d3.hierarchy(this.graphData).sum(d => d.value);
      d3
        .treemap()
        .size([this.width, this.height])
        .padding(0)
        .round(true)(root);
      try {
        treemapGroup
          .selectAll("rect")
          .data(root.leaves())
          .enter()
          .append("rect")
          .on("mouseover", function(d) {
            treemapGroup.selectAll("rect").attr("fill-opacity", 0.3);
            d3.select(this)
              .attr("stroke", "black")
              .attr("stroke-width", 1)
              .attr("fill-opacity", 0.75);
            const coordinates = [d3.event.pageX, d3.event.pageY];
            const tooltipContent = `
                <span class="tooltip__title">${d.parent.data.name}</span><br>
                <span class="tooltip__subtitle">${
                  d.data.name
                }</span>: <span class="tooltip__value">${Math.round(
              d.data.value
            )} ha</span>
              `;
            d3.select("#tooltip__treemap")
              .style("left", `${coordinates[0] + 15}px`)
              .style("top", `${coordinates[1] + 10}px`)
              .style("display", "block")
              .style("font-size", "11px")
              .html(tooltipContent);
          })
          .on("mousemove", function() {
            const coordinates = [d3.event.pageX, d3.event.pageY];
            d3.select("#tooltip__treemap")
              .style("left", `${coordinates[0] + 15}px`)
              .style("top", `${coordinates[1] + 10}px`);
          })
          .on("mouseout", function() {
            treemapGroup
              .selectAll("rect")
              .attr("fill-opacity", 0.75)
              .attr("stroke-width", 0.25)
              .attr("stroke", "gray");
            d3.select("#tooltip__treemap").style("display", "none");
          })
          .attr("x", d => d.x0)
          .attr("y", d => d.y0)
          .attr("fill-opacity", 0.75)
          .attr("fill", d => d.data.color)
          .attr("stroke-width", 0.25)
          .attr("stroke", "gray")
          .attr("width", d => d.x1 - d.x0)
          .attr("height", d => d.y1 - d.y0);
      } catch (error) {
        console.log(error);
      }
    }
  },
  mounted() {
    this.$store.dispatch("changeYear", this.graphData.years.slice(-1)[0]);
    this.render();
  }
};
</script>
