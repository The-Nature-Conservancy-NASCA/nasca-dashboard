<template>
  <section class="stacked-area">
    <div ref="graph" class="graph__container"></div>
  </section>
</template>
<style lang="scss" scoped>
.graph__container {
  width: 90%;
  height: 15rem;
  margin-top: 1rem;

  @media screen and (min-height: 900px) {
    height: 18rem;
  }
}
.stacked-area {
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
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
    },
    graphId: {
      type: String,
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
      if (!this.graphData.data.length) {
        return;
      }
      this.color = d3.scaleOrdinal(d3.schemeCategory10);
      this.currentYear = new Date().getFullYear();
      this.margin = { top: 10, right: 10, bottom: 20, left: 30 };
      this.tooltipOffset = 15;
      this.width =
        parseInt(this.el.style("width")) - this.margin.left - this.margin.right;
      this.height =
        parseInt(this.el.style("height")) -
        this.margin.top -
        this.margin.bottom;
      this.xlabel = "Año";
      this.ylabel = "Carbono";
      this.title = "Captura de carbono";
      const areaGroup = this.el
        .append("svg")
        .attr("id", this.graphId)
        .attr("class", "area graph")
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
          .tickSizeOuter(0)
          .tickFormat(d => parseInt(d))
          .ticks(5);
        const yAxis = d3
          .axisLeft()
          .scale(yScale)
          .tickSizeOuter(0)
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
        // const areaBeforeCurrentYear = d3
        //   .area()
        //   .defined(d => d.data.year <= this.currentYear)
        //   .x(d => xScale(d.data.year))
        //   .y0(d => yScale(d[0]))
        //   .y1(d => yScale(d[1]));
        const area = d3
          .area()
          .x(d => xScale(d.data.year))
          .y0(d => yScale(d[0]))
          .y1(d => yScale(d[1]));
        const that = this;
        areaGroup
          .append("g")
          .selectAll("path")
          .data(series)
          .enter()
          .append("path")
          .on("mouseover", function(d) {
            const label = d.key;
            const svgCoordinates = d3.mouse(this);
            const year = Math.ceil(xScale.invert(svgCoordinates[0]));
            const accumulatedValue = d.find(item => item.data.year == year)[1];
            const value = d.find(item => item.data.year == year).data[label];
            const areaBeforeYear = d3
              .area()
              .defined(d => d.data.year <= year)
              .x(d => xScale(d.data.year))
              .y0(d => yScale(d[0]))
              .y1(d => yScale(d[1]));
            const areaAfterYear = d3
              .area()
              .defined(d => d.data.year >= year)
              .x(d => xScale(d.data.year))
              .y0(d => yScale(d[0]))
              .y1(d => yScale(d[1]));
            areaGroup
              .append("g")
              .attr("class", "area__before")
              .selectAll("path")
              .data(series)
              .enter()
              .append("path")
              .attr("d", areaBeforeYear)
              .attr("fill", d => (d.key == label ? "none" : "white"))
              .attr("fill-opacity", d => (d.key == label ? 1 : 0.8))
              .attr("stroke", d => (d.key == label ? "black" : "none"))
              .attr("pointer-events", "none");
            areaGroup
              .append("g")
              .attr("class", "area__after")
              .selectAll("path")
              .data(series)
              .enter()
              .append("path")
              .attr("d", areaAfterYear)
              .attr("fill", "white")
              .attr("fill-opacity", 0.8)
              .attr("pointer-events", "none");
            areaGroup
              .select(".vertical.helper__line")
              .attr("x1", xScale(year))
              .attr("x2", xScale(year))
              .attr("y1", yScale.range()[0])
              .attr("y2", yScale(accumulatedValue));
            areaGroup
              .select(".horizontal.helper__line")
              .attr("x1", xScale.range()[0])
              .attr("x2", xScale(year))
              .attr("y1", yScale(accumulatedValue))
              .attr("y2", yScale(accumulatedValue));
            areaGroup.selectAll(".helper__line").attr("visibility", "visible");
            areaGroup.selectAll(".helper__line").raise();
            areaGroup.select(".year__division").raise();
            const coordinates = [d3.event.pageX, d3.event.pageY];
            const tooltipContent = `
            <span class="tooltip__title">${d.key}</span><br>
            <span class="tooltip__subtitle">Año: </span><span class="tooltip__value">${year}</span>
            <br>
            <span class="tooltip__subtitle">Valor: </span><span class="tooltip__value">${Math.round(
              value
            )} MtCO2e</span>
            `;
            d3.select("#tooltip__graph")
              .style("left", `${coordinates[0] + that.tooltipOffset}px`)
              .style("top", `${coordinates[1]}px`)
              .style("display", "block")
              .style("font-size", "11px")
              .html(tooltipContent);
          })
          .on("mousemove", function(d) {
            const label = d.key;
            const svgCoordinates = d3.mouse(this);
            const year = Math.ceil(xScale.invert(svgCoordinates[0]));
            const accumulatedValue = d.find(item => item.data.year == year)[1];
            const value = d.find(item => item.data.year == year).data[label];
            const areaBeforeYear = d3
              .area()
              .defined(d => d.data.year <= year)
              .x(d => xScale(d.data.year))
              .y0(d => yScale(d[0]))
              .y1(d => yScale(d[1]));
            const areaAfterYear = d3
              .area()
              .defined(d => d.data.year >= year)
              .x(d => xScale(d.data.year))
              .y0(d => yScale(d[0]))
              .y1(d => yScale(d[1]));
            d3.selectAll(".area__before").remove();
            d3.selectAll(".area__after").remove();
            areaGroup
              .append("g")
              .attr("class", "area__before")
              .selectAll("path")
              .data(series)
              .enter()
              .append("path")
              .attr("d", areaBeforeYear)
              .attr("fill", d => (d.key == label ? "none" : "white"))
              .attr("fill-opacity", d => (d.key == label ? 1 : 0.8))
              .attr("stroke", d => (d.key == label ? "black" : "none"))
              .attr("pointer-events", "none");
            areaGroup
              .append("g")
              .attr("class", "area__after")
              .selectAll("path")
              .data(series)
              .enter()
              .append("path")
              .attr("d", areaAfterYear)
              .attr("fill", "white")
              .attr("fill-opacity", 0.8)
              .attr("pointer-events", "none");
            d3.select(".vertical.helper__line")
              .attr("x1", xScale(year))
              .attr("x2", xScale(year))
              .attr("y1", yScale.range()[0])
              .attr("y2", yScale(accumulatedValue));
            d3.select(".horizontal.helper__line")
              .attr("x1", xScale.range()[0])
              .attr("x2", xScale(year))
              .attr("y1", yScale(accumulatedValue))
              .attr("y2", yScale(accumulatedValue));
            d3.selectAll(".helper__line").raise();
            d3.select(".year__division").raise();
            const coordinates = [d3.event.pageX, d3.event.pageY];
            const tooltipValue = Number(Math.round(value)).toLocaleString("en");
            const tooltipContent = `
            <span class="tooltip__title">${label} (${year})</span>
            <hr>
            <span class="tooltip__value">${tooltipValue} MtCO2e</span>
            `;
            d3.select("#tooltip__graph")
              .style("left", `${coordinates[0] + that.tooltipOffset}px`)
              .style("top", `${coordinates[1]}px`)
              .html(tooltipContent);
          })
          .on("mouseout", function() {
            d3.selectAll(".area__before").remove();
            d3.selectAll(".area__after").remove();
            areaGroup.selectAll(".helper__line").attr("visibility", "hidden");
            d3.select("#tooltip__graph").style("display", "none");
          })
          .attr("class", "area")
          .attr("d", area)
          .attr("fill", d => this.color(d.key));
        areaGroup
          .append("g")
          .attr("class", "x axis")
          .attr(
            "transform",
            `translate(0, ${this.height - this.margin.bottom})`
          )
          .call(xAxis);
        areaGroup
          .append("g")
          .attr("class", "y axis")
          .attr("transform", `translate(${this.margin.left}, 0)`)
          .call(yAxis);
        const yearDivision = areaGroup
          .append("g")
          .attr("class", "year__division")
          .attr("pointer-events", "none");
        yearDivision
          .append("line")
          .attr("x1", xScale(this.currentYear))
          .attr("x2", xScale(this.currentYear))
          .attr("y1", yScale.range()[0])
          .attr("y2", yScale.range()[1])
          .attr("pointer-events", "none")
          .attr("stroke", "red");
        yearDivision
          .append("text")
          .attr("y", xScale(this.currentYear) - 5)
          .attr("x", yScale.range()[1] - this.margin.bottom)
          .attr("transform", "rotate(-90)")
          .attr("text-anchor", "end")
          .attr("font-size", 9)
          .attr("fill", "red")
          .text("Cierre");
        // areaGroup
        //   .append("text")
        //   .attr("class", "title")
        //   .attr("text-anchor", "middle")
        //   .attr(
        //     "x",
        //     (this.width - this.margin.left - this.margin.right) / 2 +
        //       this.margin.left -
        //       this.margin.right
        //   )
        //   .attr("y", 0)
        //   .text(this.title);
        areaGroup
          .append("text")
          .attr("class", "x label")
          .attr("text-anchor", "end")
          .attr("font-size", 10)
          .attr("font-weight", "bold")
          .attr("x", this.width - this.margin.right)
          .attr("y", this.height + 15)
          .text(this.xlabel);
        areaGroup
          .append("text")
          .attr("text-anchor", "start")
          .attr("font-size", 10)
          .attr("font-weight", "bold")
          .attr("x", this.margin.left)
          .attr("y", 0)
          .text(this.ylabel);

        // areaGroup
        //   .append("g")
        //   .selectAll("path")
        //   .data(series)
        //   .enter()
        //   .append("path")
        //   .attr("class", "area__before")
        //   .attr("pointer-events", "none");

        areaGroup.append("line").attr("class", "vertical helper__line");
        areaGroup.append("line").attr("class", "horizontal helper__line");
        areaGroup
          .selectAll(".helper__line")
          .attr("visibility", "hidden")
          .attr("pointer-events", "none")
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "3");
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
