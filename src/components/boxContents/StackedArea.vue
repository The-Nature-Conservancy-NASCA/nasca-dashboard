<template>
  <section>
    <div>
      <button>Total</button>
      <button>Compartimiento</button>
      <button>SNC</button>
    </div>
    <div ref="graph" class="graph__container"></div>
    <div id="tooltip__stackedarea" class="tooltip__graph"></div>
  </section>
</template>
<style lang="scss" scoped>
.graph__container {
  width: 600px;
  height: 300px;
}
</style>
<script>
import * as d3 from "d3";

export default {
  name: "StackedArea",
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
      this.color = d3.scaleOrdinal(d3.schemeCategory10);
      this.margin = { top: 10, right: 10, bottom: 10, left: 25 };
      this.offset = { left: 10, bottom: 10 };
      this.width =
        parseInt(this.el.style("width")) - this.margin.left - this.margin.right;
      this.height =
        parseInt(this.el.style("height")) -
        this.margin.top -
        this.margin.bottom;
      const areaGroup = this.el
        .append("svg")
        .attr("class", "area")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr(
          "transform",
          `translate(${this.margin.left}, ${this.margin.top})`
        );
      try {
        const xScale = d3
          .scaleLinear()
          .domain([d3.min(this.graphData.years), d3.max(this.graphData.years)])
          .range([this.margin.left, this.width - this.margin.right]);
        const yScale = d3
          .scaleLinear()
          .domain([
            0,
            d3.max(this.graphData.data, d => {
              const { year, ...obj } = d;
              year + 0;
              return Object.values(obj).reduce((a, b) => a + b, 0);
            })
          ])
          .range([this.height - this.margin.bottom, this.margin.bottom / 2])
          .nice();
        const xAxis = d3
          .axisBottom()
          .scale(xScale)
          .tickFormat(d => parseInt(d))
          .ticks(10);
        const yAxis = d3
          .axisLeft()
          .scale(yScale)
          .ticks(5);
        const keys = [];
        this.graphData.data.forEach(el => {
          const elKeys = Object.keys(el).filter(item => item !== "year");
          elKeys.forEach(key => {
            if (!keys.includes(key)) {
              keys.push(key);
            }
          });
        });
        const stack = d3
          .stack()
          .keys(keys)
          .order(d3.stackOrderDescending);
        const series = stack(this.graphData.data);
        const area = d3
          .area()
          .x(d => xScale(d.data.year))
          .y0(d => yScale(d[0]))
          .y1(d => yScale(d[1]));
        areaGroup
          .selectAll("path")
          .data(series)
          .enter()
          .append("path")
          .on("mouseover", function(d) {
            areaGroup.selectAll("path").attr("fill-opacity", 0.3);
            d3.select(this)
              .attr("stroke", "black")
              .attr("fill-opacity", 0.75);
            const label = d.key;
            const q = d.slice(-1)[0][1] - d.slice(-1)[0][0];
            const coordinates = [d3.event.pageX, d3.event.pageY];
            const tooltipContent = `
          <span class="tooltip__title">${label}</span><br>
          <span class="tooltip__value">${Math.round(
            q
          )}</span><span class="tooltip__subtitle"> MtCO2e</span>
          `;
            d3.select("#tooltip__stackedarea")
              .style("left", `${coordinates[0]}px`)
              .style("top", `${coordinates[1] + 90}px`)
              .style("display", "block")
              .style("font-size", "11px")
              .html(tooltipContent);
          })
          .on("mousemove", function() {
            const coordinates = [d3.event.pageX, d3.event.pageY];
            d3.select("#tooltip__stackedarea")
              .style("left", `${coordinates[0]}px`)
              .style("top", `${coordinates[1]}px`);
          })
          .on("mouseout", function() {
            areaGroup.selectAll("path").attr("fill-opacity", 0.75);
            d3.select(this).attr("stroke", "none");
            d3.select("#tooltip__stackedarea").style("display", "none");
          })
          .attr("class", "area")
          .attr("d", area)
          .attr("fill", d => this.color(d.key));
        areaGroup
          .append("g")
          .attr("class", "axis")
          .attr(
            "transform",
            `translate(0, ${this.height - this.margin.bottom})`
          )
          .call(xAxis);
        areaGroup
          .append("g")
          .attr("class", "axis")
          .attr("transform", `translate(${this.margin.left}, 0)`)
          .call(yAxis);
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
