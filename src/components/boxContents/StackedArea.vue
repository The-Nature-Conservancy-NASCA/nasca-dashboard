<template>
  <div ref="graph" class="graph__container"></div>
</template>
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
    },
    xlabel: {
      type: String,
      required: false
    },
    ylabel: {
      type: String,
      required: false
    },
    closureLabel: {
      type: String,
      required: false
    }
  },
  computed: {
    strings() {
      return this.$store.getters.strings;
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
    },
    strings() {
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
      this.colors = {
        Total: "#49A942",
        Biomasa: "#49A942",
        Suelos: "#ffa600",
        "Madera muerta": "#003f5c",
        "Cercas vivas": "#ef5675",
        "Árboles dispersos en potreros": "#ffa600",
        Bosque: "#49A942",
        "Bosque secundario": "#4F7942",
        "Sistemas silvopastoriles intensivos": "#7a5195"
      };
      this.closingYear = this.$store.getters.selectedProjectClosingYear;
      this.margin = { top: 10, right: 25, bottom: 10, left: 25 };
      this.tooltipOffset = 20;
      this.decimals = 2;
      this.width =
        parseInt(this.el.style("width")) - this.margin.left - this.margin.right;
      this.height =
        parseInt(this.el.style("height")) -
        this.margin.top -
        this.margin.bottom;
      this.fontSize;
      if (screen.height <= 768) {
        this.fontSize = "10px";
        this.smallerFontSize = "9px";
      } else if (screen.width > 900 && screen.width <= 1280) {
        this.fontSize = "12px";
        this.smallerFontSize = "11px";
      } else {
        this.fontSize = "14px";
        this.smallerFontSize = "13px";
      }
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
          .tickSize(3)
          .tickFormat(d => parseInt(d))
          .ticks(5);
        const yAxis = d3
          .axisRight()
          .scale(yScale)
          .tickSizeOuter(0)
          .tickSize(0)
          .ticks(3)
          .tickFormat(d => d.toFixed(this.decimals));
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
        const line = d3
          .line()
          .x(d => xScale(d.data.year))
          .y(d => yScale(d[1]));
        areaGroup
          .append("g")
          .selectAll("line")
          .data(yScale.ticks(3))
          .enter()
          .append("line")
          .attr("x1", this.margin.left)
          .attr("x2", xScale(xScale.domain()[1]))
          .attr("y1", d => yScale(d))
          .attr("y2", d => yScale(d))
          .attr("stroke-width", 0.5)
          .attr("stroke", "LightGray");
        const that = this;
        areaGroup
          .append("g")
          .selectAll("path")
          .data(series)
          .enter()
          .append("path")
          .attr("class", "area")
          .on("mouseover", function(d) {
            const label = d.key;
            const svgCoordinates = d3.mouse(this);
            const year = Math.ceil(xScale.invert(svgCoordinates[0]));
            const accumulatedValue = d.find(item => item.data.year == year)[1];
            const value = d.find(item => item.data.year == year).data[label];
            areaGroup
              .selectAll("path.area")
              .attr("fill-opacity", d => (d.key == label ? 0.5 : 0.1));
            areaGroup
              .selectAll("path.line")
              .attr("stroke-opacity", d => (d.key == label ? 1 : 0.3));
            areaGroup
              .select(".vertical.helper__line")
              .attr("visibility", "visible")
              .attr("x1", xScale(year))
              .attr("x2", xScale(year))
              .attr("y1", yScale.range()[0])
              .attr("y2", yScale.range()[1]);
            areaGroup
              .select(".helper__dot")
              .attr("visibility", "visible")
              .attr("fill", that.colors[label])
              .attr("cx", xScale(year))
              .attr("cy", yScale(accumulatedValue));
            areaGroup.selectAll(".helper__line").raise();
            areaGroup.select(".year__division").raise();
            areaGroup.select(".helper__dot").raise();
            const tooltipValue = value.toFixed(that.decimals);
            const coordinates = [d3.event.pageX, d3.event.pageY];
            const tooltipContent = `
            <span class="tooltip__title">${label}</span><br>
            <span class="tooltip__subtitle">Año: </span><span class="tooltip__value">${year}</span>
            <br>
            <span class="tooltip__subtitle">Valor: </span><span class="tooltip__value">${tooltipValue} MtCO2e</span>
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
            areaGroup
              .selectAll("path.area")
              .attr("fill-opacity", d => (d.key == label ? 0.5 : 0.1));
            areaGroup
              .selectAll("path.line")
              .attr("stroke-opacity", d => (d.key == label ? 1 : 0.3));
            areaGroup
              .select(".vertical.helper__line")
              .attr("x1", xScale(year))
              .attr("x2", xScale(year))
              .attr("y1", yScale.range()[0])
              .attr("y2", yScale.range()[1]);
            areaGroup
              .select(".helper__dot")
              .attr("fill", that.colors[label])
              .attr("cx", xScale(year))
              .attr("cy", yScale(accumulatedValue));
            areaGroup.selectAll(".helper__line").raise();
            areaGroup.select(".year__division").raise();
            areaGroup.select(".helper__dot").raise();
            const coordinates = [d3.event.pageX, d3.event.pageY];
            const tooltipValue = value.toFixed(that.decimals);
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
            areaGroup.selectAll("path.area").attr("fill-opacity", 0.3);
            areaGroup.selectAll("path.line").attr("stroke-opacity", 1);
            areaGroup.select(".helper__line").attr("visibility", "hidden");
            areaGroup.select(".helper__dot").attr("visibility", "hidden");
            d3.select("#tooltip__graph").style("display", "none");
          })
          .attr("class", "area")
          .attr("d", area)
          .attr("fill", d => this.colors[d.key])
          .attr("fill-opacity", 0.3);
        areaGroup
          .append("g")
          .selectAll("path")
          .data(series)
          .enter()
          .append("path")
          .attr("class", "line")
          .attr("d", line)
          .attr("pointer-events", "none")
          .attr("fill", "none")
          .attr("stroke", d => this.colors[d.key])
          .attr("stroke-width", 1);
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
          .attr("transform", `translate(${this.margin.left}, -5)`)
          .call(yAxis);
        areaGroup
          .selectAll(".x.axis .domain, .axis .tick line")
          .attr("stroke", "LightGray");
        areaGroup.select(".y.axis .tick").remove();
        areaGroup.select(".y.axis .domain").attr("stroke", "none");
        const yearDivision = areaGroup
          .append("g")
          .attr("class", "year__division")
          .attr("pointer-events", "none");
        yearDivision
          .append("line")
          .attr("x1", xScale(this.closingYear))
          .attr("x2", xScale(this.closingYear))
          .attr("y1", yScale.range()[0])
          .attr("y2", yScale.range()[1])
          .attr("pointer-events", "none")
          .attr("stroke", "black")
          .attr("stroke-width", 0.75);
        if (this.closureLabel) {
          yearDivision
            .append("text")
            .attr("y", xScale(this.closingYear) - 5)
            .attr("x", yScale.range()[1] - this.margin.bottom)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "end")
            .attr("font-size", this.smallerFontSize)
            .attr("fill", "black")
            .text(this.closureLabel);
        }
        if (this.xlabel) {
          areaGroup
            .append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("font-size", this.fontSize)
            .attr("font-weight", "bold")
            .attr("x", this.width - (this.margin.right + 10))
            .attr("y", this.height - (this.margin.bottom + 5))
            .text(this.xlabel);
        }
        if (this.ylabel) {
          areaGroup
            .append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", this.fontSize)
            .attr("font-weight", "bold")
            .attr("transform", "rotate(-90)")
            .attr(
              "x",
              -(this.margin.top + this.height / 2 - this.margin.bottom)
            )
            .attr("y", 0)
            .text(this.ylabel);
        }
        areaGroup
          .append("line")
          .attr("class", "vertical helper__line")
          .attr("visibility", "hidden")
          .attr("pointer-events", "none")
          .attr("stroke", "black")
          .attr("stroke-dasharray", "3")
          .attr("stroke-width", 0.5);
        areaGroup
          .append("circle")
          .attr("class", "helper__dot")
          .attr("visibility", "hidden")
          .attr("stroke", "white")
          .attr("r", 3)
          .attr("pointer-events", "none");
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
  width: 100%;
  height: 150px;
  flex: 1;

  @media screen and (min-height: 900px) {
    height: 18rem;
  }
}
</style>
