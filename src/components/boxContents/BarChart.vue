<template>
  <section ref="graph" class="graph__container"></section>
</template>
<style lang="scss" scoped>
.graph__container {
  width: 100%;
  height: 100%;
  padding: 1rem;
}

svg.bar.chart {
  overflow: visible;
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
    dataDomainUpperBound: {
      type: Number,
      required: false
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
    }
  },
  computed: {
    strings() {
      return this.$store.getters.strings;
    },
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
    },
    strings() {
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
      this.margin = { top: 5, right: 10, bottom: 5, left: 10 };
      this.offset = { left: 10, bottom: 10 };

      // compute width and height based on parent div
      this.parentWidth =
        parseInt(this.el.style("width")) -
        parseInt(this.el.style("padding-left")) -
        parseInt(this.el.style("padding-right"));
      this.parentHeight =
        parseInt(this.el.style("height")) -
        parseInt(this.el.style("padding-top")) -
        parseInt(this.el.style("padding-bottom"));
      this.width =
        this.parentWidth -
        this.margin.left -
        this.margin.right -
        this.offset.left;
      this.height =
        this.parentHeight -
        this.margin.top -
        this.margin.bottom -
        this.offset.bottom;

      this.color = "#4AA241";
      this.factor = 0.6;
      this.tooltipOffset = 15;
      this.fontSize;
      if (screen.height <= 768) {
        this.fontSize = "10px";
      } else if (screen.width > 900 && screen.width <= 1280) {
        this.fontSize = "12px";
      } else {
        this.fontSize = "14px";
      }
      const barGroup = this.el
        .append("svg")
        .attr("id", this.graphId)
        .attr("class", "bar chart")
        .attr(
          "width",
          this.width + this.margin.left + this.margin.right + this.offset.left
        )
        .attr(
          "height",
          this.height +
            this.margin.top +
            this.margin.bottom +
            this.offset.bottom
        )
        .append("g")
        .attr(
          "transform",
          `translate(${this.margin.left}, ${this.margin.top})`
        );
      try {
        let domainUpperBound;
        if (this.dataDomainUpperBound) {
          domainUpperBound = this.dataDomainUpperBound;
        } else {
          domainUpperBound = d3.max(this.graphData, d => d.value);
        }
        this.xScale = d3
          .scaleBand()
          .domain(d3.range(this.graphData.length))
          .range([this.offset.bottom, this.height])
          .paddingInner(0.05);
        this.yScale = d3
          .scaleLog()
          .clamp(true)
          .domain([0.1, domainUpperBound])
          .range([0, this.width - this.offset.left]);
        let exp = -1;
        let domainFits = true;
        let result;
        const xTicks = [];
        while (domainFits) {
          result = domainUpperBound / 10 ** exp;
          if (result >= 1) {
            xTicks.push(10 ** exp);
            exp += 1;
          } else {
            domainFits = false;
          }
        }
        const xAxis = d3
          .axisBottom()
          .scale(this.yScale)
          .tickValues(xTicks)
          .tickSizeOuter(0)
          .tickFormat(d => d.toLocaleString("en"));
        const yAxis = d3
          .axisLeft()
          .scale(this.xScale)
          .tickValues([])
          .tickSize(0);
        const that = this;
        barGroup
          .selectAll("rect")
          .data(this.graphData)
          .enter()
          .append("rect")
          .on("mouseover", function(d) {
            barGroup.selectAll("rect").attr("fill-opacity", 0.2);
            d3.select(this)
              .attr("stroke", "black")
              .attr("fill-opacity", 1);
            const coordinates = [d3.event.pageX, d3.event.pageY];
            const value = new Number(Math.round(d.value)).toLocaleString("en");
            const tooltipContent = `
              <span class="tooltip__title">${d.name}</span>
              <hr>
              <span class="tooltip__value">${value}</span><span class="tooltip__subtitle"> ha</span>
            `;
            d3.select("#tooltip__graph")
              .style("left", `${coordinates[0] + that.tooltipOffset}px`)
              .style("top", `${coordinates[1]}px`)
              .style("display", "block")
              .style("font-size", "11px")
              .html(tooltipContent);
          })
          .on("mousemove", function() {
            const coordinates = [d3.event.pageX, d3.event.pageY];
            d3.select("#tooltip__graph")
              .style("left", `${coordinates[0] + that.tooltipOffset}px`)
              .style("top", `${coordinates[1]}px`);
          })
          .on("mouseout", function() {
            barGroup.selectAll("rect").attr("fill-opacity", 1);
            d3.select(this).attr("stroke", "none");
            d3.select("#tooltip__graph")
              .html("")
              .style("display", "none");
          })
          .attr(
            "y",
            (d, i) =>
              this.xScale(i) -
              this.margin.bottom -
              this.offset.bottom +
              (this.xScale.bandwidth() * (1 - this.factor)) / 2
          )
          .attr("x", () => this.margin.left + this.offset.left)
          .attr("height", this.xScale.bandwidth() * this.factor)
          .attr("fill", this.color)
          .attr("width", d => this.yScale(d.value));
        barGroup
          .selectAll("text")
          .data(this.graphData)
          .enter()
          .append("text")
          .attr("x", this.margin.left + this.offset.left + 5)
          .attr(
            "y",
            (d, i) =>
              this.xScale(i) -
              this.margin.bottom -
              this.offset.bottom +
              this.xScale.bandwidth() / 2
          )
          .attr("text-anchor", "start")
          .attr("dominant-baseline", "middle")
          .attr("font-size", this.fontSize)
          .attr("font-weight", "normal")
          .attr("fill", "white")
          .attr("pointer-events", "none")
          .text(d => d.name)
          .each(this.wrap);
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
        const firstTickText = barGroup.select(".x.axis .tick text");
        if (firstTickText.text() === "0.1") {
          firstTickText.text("0");
        }
        if (this.xlabel) {
          barGroup
            .append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", this.width)
            .attr("y", this.height - (this.offset.bottom + this.margin.bottom))
            .attr("font-size", this.fontSize)
            .attr("font-weight", "bold")
            .text(this.xlabel);
        }
        if (this.ylabel) {
          barGroup
            .append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr(
              "x",
              -(this.height / 2) + this.margin.bottom + this.offset.bottom
            )
            .attr("y", 0)
            .attr("transform", "rotate(-90)")
            .attr("font-size", this.fontSize)
            .attr("font-weight", "bold")
            .text(this.ylabel);
        }
      } catch (error) {
        console.log(error);
      }
    },
    wrap(d, i, n) {
      const self = d3.select(n[i]);
      let textLength = self.node().getComputedTextLength();
      let text = self.text();
      const width = this.yScale(d.value);
      const padding = 5;
      while (textLength > width - 2 * padding && text.length > 0) {
        text = text.slice(0, -1);
        self.text(text + "...");
        textLength = self.node().getComputedTextLength();
      }
    }
  },
  created() {
    window.addEventListener("resize", this.render);
  },
  mounted() {
    this.render();
  }
};
</script>
