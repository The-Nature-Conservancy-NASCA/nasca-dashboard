<template>
  <section class="bar-chart">
    <div ref="graph" class="graph__container"></div>
    <div id="tooltip__barchart" class="tooltip__graph"></div>
    <div>
      <button v-for="year in years" :key="year" @click="changeYear(year)">
        {{ year }}
      </button>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.graph__container {
  width: 100rem;
  height: 12rem;
}
.bar-chart {
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
<script>
import * as d3 from "d3";

export default {
  name: "BarChart",
  props: {
    graphData: {
      type: Array,
      required: true
    },
    graphId: {
      typre: String,
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

      if (!this.graphData.length) {
        return;
      }

      this.margin = { top: 10, right: 10, bottom: 20, left: 75 };
      this.offset = { left: 10, bottom: 10 };

      // compute width and height based on parent div
      this.width =
        parseInt(this.el.style("width")) - this.margin.left - this.margin.right;
      this.height =
        parseInt(this.el.style("height")) -
        this.margin.top -
        this.margin.bottom;

      this.color = "#6EA19F";
      this.factor = 0.5;

      this.title = "Área total por acción";
      this.ylabel = "Acción";
      this.xlabel = "Área (ha)";

      const barGroup = this.el
        .append("svg")
        .attr("id", this.graphId)
        .attr("class", "bar graph")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr(
          "transform",
          `translate(${this.margin.left}, ${this.margin.top})`
        );
      try {
        const xScale = d3
          .scaleBand()
          .domain(d3.range(this.graphData.length))
          .range([this.margin.bottom + this.offset.bottom, this.height])
          .paddingInner(0.05);
        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(this.graphData, d => d.value)])
          .range([0, this.width - this.margin.left - this.offset.left]);
        var xAxis = d3
          .axisBottom()
          .scale(yScale)
          .ticks(5);
        var yAxis = d3
          .axisLeft()
          .scale(xScale)
          .tickFormat((d, i) => this.graphData[i].name);
        barGroup
          .selectAll("rect")
          .data(this.graphData)
          .enter()
          .append("rect")
          .on("mouseover", function(d) {
            barGroup.selectAll("rect").attr("fill-opacity", 0.3);
            d3.select(this)
              .attr("stroke", "black")
              .attr("fill-opacity", 0.75);
            const coordinates = [d3.event.pageX, d3.event.pageY];
            const tooltipContent = `
          <span class="tooltip__value">${Math.round(
            d.value
          )}</span><span class="tooltip__subtitle"> ha</span>
          `;
            d3.select("#tooltip__barchart")
              .style("left", `${coordinates[0] + 15}px`)
              .style("top", `${coordinates[1] + 10}px`)
              .style("display", "block")
              .style("font-size", "11px")
              .html(tooltipContent);
          })
          .on("mousemove", function() {
            const coordinates = [d3.event.pageX, d3.event.pageY];
            d3.select("#tooltip__barchart")
              .style("left", `${coordinates[0] + 15}px`)
              .style("top", `${coordinates[1] + 10}px`);
          })
          .on("mouseout", function() {
            barGroup.selectAll("rect").attr("fill-opacity", 0.75);
            d3.select(this).attr("stroke", "none");
            d3.select("#tooltip__barchart").style("display", "none");
          })
          .attr(
            "y",
            (d, i) =>
              xScale(i) -
              this.margin.bottom -
              this.offset.bottom +
              (xScale.bandwidth() * (1 - this.factor)) / 2
          )
          .attr("x", () => this.margin.left + this.offset.left)
          .attr("height", xScale.bandwidth() * this.factor)
          .attr("fill", this.color)
          .transition()
          .attr("width", d => yScale(d.value));
        barGroup
          .append("g")
          .attr("class", "y axis")
          .attr(
            "transform",
            `translate(${this.margin.left}, ${-this.margin.bottom -
              this.offset.bottom})`
          )
          .call(yAxis);
        barGroup
          .append("g")
          .attr("class", "x axis")
          .attr(
            "transform",
            `translate(${this.margin.left + this.offset.left}, ${this.height -
              this.margin.bottom})`
          )
          .call(xAxis);
        barGroup
          .append("text")
          .attr("class", "title")
          .attr("text-anchor", "middle")
          .attr(
            "x",
            (this.width - this.margin.left - this.margin.right) / 2 +
              this.margin.left -
              this.margin.right
          )
          .attr("y", 0)
          .text(this.title);
        barGroup
          .append("text")
          .attr("class", "x label")
          .attr("text-anchor", "middle")
          .attr(
            "x",
            (this.width - this.margin.left - this.margin.right) / 2 +
              this.margin.left -
              this.margin.right
          )
          .attr("y", this.height + this.margin.bottom - 2)
          .text(this.xlabel);
        barGroup
          .append("text")
          .attr("text-anchor", "middle")
          .attr("x", -(this.height / 2))
          .attr("y", () => {
            const yAxisWidth = d3
              .select(".y.axis")
              .node()
              .getBBox().width;
            return -(yAxisWidth + this.offset.left + 10);
          })
          .attr("transform", "rotate(-90)")
          .text(this.ylabel);
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
