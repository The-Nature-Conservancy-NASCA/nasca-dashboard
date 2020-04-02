<template>
  <section class="bar-chart">
    <div ref="graph" class="graph__container"></div>
    <div>
      <button v-for="year in years" :key="year" @click="changeYear(year)">
        {{ year }}
      </button>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.graph__container {
  width: 90%;
  height: 15rem;
  margin: 0 auto;
  flex: 1;

  @media screen and (min-height: 800px) {
    height: 20rem;
  }

  @media screen and (min-height: 1000px) {
    height: 24rem;
  }

  @media screen and (max-width: 768px) {
    height: 45rem;
  }

  @media screen and (max-width: 440px) {
    height: 25rem;
  }
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
      this.margin = { top: 10, right: 10, bottom: 20, left: 10 };
      this.offset = { left: 10, bottom: 10 };
      this.width =
        parseInt(this.el.style("width")) - this.margin.left - this.margin.right;
      this.height =
        parseInt(this.el.style("height")) -
        this.margin.top -
        this.margin.bottom;
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
        .attr("class", "bar graph")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
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
          .range([this.margin.bottom + this.offset.bottom, this.height])
          .paddingInner(0.05);
        this.yScale = d3
          .scaleLog()
          .clamp(true)
          .domain([0.1, domainUpperBound])
          .range([0, this.width - this.margin.left - this.offset.left]);
        var xAxis = d3
          .axisBottom()
          .scale(this.yScale)
          .ticks(4)
          .tickSizeOuter(0)
          .tickFormat(d => d.toLocaleString("en"));
        var yAxis = d3
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
          .transition()
          .attr("width", d => this.yScale(d.value));
        barGroup
          .selectAll("text")
          .data(this.graphData)
          .enter()
          .append("text")
          .attr(
            "x",
            d => this.yScale(d.value) / 2 + this.margin.left + this.offset.left
          )
          .attr(
            "y",
            (d, i) =>
              this.xScale(i) -
              this.margin.bottom -
              this.offset.bottom +
              this.xScale.bandwidth() / 2
          )
          .attr("text-anchor", "middle")
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
            .attr("text-anchor", "end")
            .attr("x", 0)
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
  mounted() {
    this.render();
  }
};
</script>
<style lang="scss" scoped>
svg.bar.graph {
  overflow: visible;
}
</style>