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
      select(svg).append('p').text('Hola desde D3');
  }
}
</script>