<template>
  <section>
    <div ref="graph" class="graph__container"></div>
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
  data() {
    return {
      el: null,
      margin: null,
      width: 0,
      height: 0,
      color: null
    }
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
      this.margin = { top: 10, right: 10, bottom: 10, left: 10 };
      this.width = parseInt(this.el.style("width")) - this.margin.left - this.margin.right;
      this.height = parseInt(this.el.style("height")) - this.margin.top - this.margin.bottom;
      this.color = d3.scaleOrdinal(d3.schemeCategory10);

      const treemapGroup = this.el
        .append("svg")
        .attr("class", "treemap")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

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
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("fill-opacity", 0.75)
            .attr("fill", d => this.color(d.parent.data.name))
            .attr("stroke-width", 0.25)
            .attr("stroke", "gray")
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0);
      } catch(error) {
        console.log(error);
      }
    }
  },
  mounted() {
    this.render();
  }
};
</script>
