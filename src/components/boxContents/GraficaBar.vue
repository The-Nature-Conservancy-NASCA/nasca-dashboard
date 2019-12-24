<template>
  <section>
    <svg ref="bar-graph" width="500" height="500"></svg>
  </section>
</template>
<script>
import { select } from 'd3';

export default {
  name: 'GraficaBar',
  mounted() {
    const svg = this.$refs['bar-graph'];
    select(svg)
      .append("circle")
        .attr("cx", 50)
        .attr("cy", 50)
        .attr("r", 10);
  }
}
</script>