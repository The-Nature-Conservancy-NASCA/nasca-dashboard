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
import * as d3 from 'd3';

export default {
  name: 'Treemap',
  mounted() {
    const el = d3.select(this.$refs['graph']);
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    const width = parseInt(el.style("width")) - margin.left - margin.right;
    const height = parseInt(el.style("height")) - margin.top - margin.bottom;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const treemapGroup = el
      .append("svg")
        .attr("class", "treemap")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const data = {
      name: "coberturas",
      "children": [
        {
          "name": "Vegetacion en transicion",
          "children": [
            {
              "name": "Vegetacion en transicion",
              "value": 230
            }
          ]
        },
        {
          "name": "Pastos",
          "children": [
            {
              "name": "Pastos limpios",
              "value": 20
            },
            {
              "name": "Pastos enmalezados",
              "value": 6
            },
            {
              "name": "Pastos arbolados",
              "value": 1
            }
          ]
        },
        {
          "name": "Bosque",
          "children": [
            {
              "name": "Bosque",
              "value": 170
            }
          ]
        },
        {
          "name": "Cultivos",
          "children": [
            {
              "name": "otros",
              "value": 14
            }
          ]
        }
      ]
    };

    const root = d3.hierarchy(data).sum(d => d.value);
    d3.treemap()
      .size([width, height])
      .padding(0)
      .round(true)
      (root);

    treemapGroup.selectAll("rect")
      .data(root.leaves())
      .enter()
      .append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("fill-opacity", 0.75)
        .attr("fill", d => color(d.parent.data.name))
        .attr("stroke-width", 0.25)
        .attr("stroke", "gray")
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0);
  }
}
</script>