<template>
  <section>
    <div ref="graph" class="graph__container"></div>
    <div id="tooltip__piechart" class="tooltip__graph"></div>
  </section>
</template>
<style lang="scss" scoped>
.graph__container {
  width: 200px;
  height: 200px;
  margin: 50px auto 50px auto;
}
</style>
<script>
import * as d3 from "d3";

export default {
  name: "PieChart",
  props: {
    graphData: {
      type: Array,
      required: true
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
    render() {
      this.el = d3.select(this.$refs["graph"]);
      this.el.html("");
      this.width = parseInt(this.el.style("width"));
      this.height = parseInt(this.el.style("height"));
      this.color = d3.scaleOrdinal(d3.schemeCategory10);
      const svg = this.el
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height);
      try {
        const outerRadius = this.width / 2;
        const innerRadius = outerRadius / 1.25;
        const arc = d3
          .arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius);
        const pie = d3.pie().value(d => d.value);
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
            svg.selectAll("g.arc path").attr("fill-opacity", 0.3);
            d3.select(this)
              .attr("stroke", "black")
              .attr("fill-opacity", 0.75);
            const coordinates = [d3.event.pageX, d3.event.pageY];
            const tooltipContent = `
        <span class="tooltip__title">${d.data.name}</span><br>
        <span class="tooltip__value">${Math.round(
          d.value
        )}</span><span class="tooltip__subtitle"> especies</span>
        `;
            d3.select("#tooltip__piechart")
              .style("left", `${coordinates[0]}px`)
              .style("top", `${coordinates[1]}px`)
              .style("display", "block")
              .style("font-size", "11px")
              .html(tooltipContent);
          })
          .on("mousemove", function() {
            const coordinates = [d3.event.pageX, d3.event.pageY];
            d3.select("#tooltip__piechart")
              .style("left", `${coordinates[0]}px`)
              .style("top", `${coordinates[1]}px`);
          })
          .on("mouseout", function() {
            svg.selectAll("g.arc path").attr("fill-opacity", 0.75);
            d3.select(this).attr("stroke", "none");
            d3.select("#tooltip__piechart").style("display", "none");
          })
          .attr("fill", d => this.color(d.data.name))
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
