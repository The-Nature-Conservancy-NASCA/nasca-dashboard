<template>
  <section class="treemap">
    <div ref="graph" class="graph__container"></div>
  </section>
</template>
<script>
import * as d3 from "d3";

export default {
  name: "Treemap",
  props: {
    component: {
      type: String,
      required: true
    },
    graphData: {
      type: Object,
      required: true
    },
    graphId: {
      type: String,
      required: true
    }
  },
  computed: {
    selectedYear() {
      return this.$store.getters.filtro.year[this.component];
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
    changeClassificationScheme(schemeName) {
      this.$store.dispatch("changeClassificationScheme", schemeName);
    },
    changeYear(year) {
      this.$store.dispatch("changeYear", {
        year: year,
        component: this.component
      });
    },
    render() {
      // console.log(this.graphData);
      this.el = d3.select(this.$refs["graph"]);
      this.el.html("");
      if (!this.graphData.children.length) {
        return;
      }
      this.margin = { top: 0, right: 0, bottom: 0, left: 0 };
      this.width =
        parseInt(this.el.style("width")) - this.margin.left - this.margin.right;
      this.height =
        parseInt(this.el.style("height")) -
        this.margin.top -
        this.margin.bottom;
      this.color = d3.scaleOrdinal(d3.schemeCategory10);
      this.tooltipOffset = 15;

      const treemapGroup = this.el
        .append("svg")
        .attr("id", this.graphId)
        .attr("class", "treemap graph")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr(
          "transform",
          `translate(${this.margin.left}, ${this.margin.top})`
        );

      const root = d3.hierarchy(this.graphData).sum(d => d.value);
      d3
        .treemap()
        .size([this.width, this.height])
        .padding(1)
        .round(true)(root);
      try {
        const that = this;
        treemapGroup
          .selectAll("rect")
          .data(root.leaves())
          .enter()
          .append("rect")
          .attr("class", d =>
            d.parent.data.name.toLowerCase().replace(/[^A-Z0-9]/gi, "_")
          )
          .on("mouseover", function(d) {
            treemapGroup
              .selectAll("rect")
              .attr("fill-opacity", 0.2)
              .attr("stroke-opacity", 0.3);
            treemapGroup.selectAll("text").attr("fill-opacity", 0.3);
            treemapGroup
              .select(`text#${that.cleanString(d.parent.data.name)}`)
              .attr("fill-opacity", 1)
              .attr("font-weight", "bold");
            d3.select(this)
              .attr("stroke-width", 1)
              .attr("fill-opacity", 1)
              .attr("stroke-opacity", 1);
            const coordinates = [d3.event.pageX, d3.event.pageY];
            const value = Number(Math.round(d.data.value)).toLocaleString("en");
            const tooltipContent = `
                <span class="tooltip__title">${d.parent.data.name}</span><br>
                <span class="tooltip__subtitle">${
                  d.data.name ? d.data.name : ""
                }</span>
                <hr>
                <span class="tooltip__value">${value} ha</span>
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
            treemapGroup
              .selectAll("rect")
              .attr("fill-opacity", 0.9)
              .attr("stroke-opacity", 1)
              .attr("stroke-width", 0.5);
            treemapGroup
              .selectAll("text")
              .attr("fill-opacity", 1)
              .attr("font-weight", "normal");
            d3.select("#tooltip__graph")
              .html("")
              .style("display", "none");
          })
          .attr("x", d => d.x0)
          .attr("y", d => d.y0)
          .attr("fill", d => d.data.color)
          .attr("fill-opacity", 0.9)
          .attr("stroke", d => this.shadeColor(d.data.color, -20))
          .attr("stroke-width", 0.5)
          .attr("stroke-opacity", 1)
          .attr("width", d => d.x1 - d.x0)
          .attr("height", d => d.y1 - d.y0);
        treemapGroup
          .selectAll("text")
          .data(this.graphData.children)
          .enter()
          .append("text")
          .attr("id", d => this.cleanString(d.name))
          .attr("class", "parent__label")
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("pointer-events", "none")
          .attr("font-size", 10)
          .attr("fill", "black")
          .attr("fill-opacity", 1)
          .attr("x", d => {
            const center = that.computeElementsCenter(
              d3
                .selectAll(
                  `.${d.name.toLowerCase().replace(/[^A-Z0-9]/gi, "_")}`
                )
                .nodes()
            );
            return center.x;
          })
          .attr("y", d => {
            const center = that.computeElementsCenter(
              d3
                .selectAll(
                  `.${d.name.toLowerCase().replace(/[^A-Z0-9]/gi, "_")}`
                )
                .nodes()
            );
            return center.y;
          })
          .text(d => d.name)
          .each(this.wrap);
        treemapGroup
          .selectAll("text.parent__label")
          .filter(function(d) {
            const selection = d3
              .selectAll(`.${d.name.toLowerCase().replace(/[^A-Z0-9]/gi, "_")}`)
              .nodes();
            const boxesBBox = that.computeElementsBBox(selection);
            const textBBox = that.computeElementsBBox([d3.select(this).node()]);
            const textWidthOverflow =
              textBBox.xmax - textBBox.xmin > boxesBBox.xmax - boxesBBox.xmin;
            const textHeightOverflow =
              textBBox.ymax - textBBox.ymin > boxesBBox.ymax - boxesBBox.ymin;
            return textWidthOverflow || textHeightOverflow;
          })
          .remove();
      } catch (error) {
        //console.error(error);
      }
    },
    buttonClass(year) {
      return {
        selected: this.selectedYear === year,
        unselected: this.selectedYear !== year
      };
    },
    cleanString(string) {
      return string.toLowerCase().replace(/[^A-Z0-9]/gi, "_");
    },
    computeElementsBBox(selection) {
      const coordinates = {
        xmin: [],
        xmax: [],
        ymin: [],
        ymax: []
      };
      selection.forEach(item => {
        const bbox = item.getBBox();
        coordinates.xmin.push(bbox.x);
        coordinates.ymin.push(bbox.y);
        coordinates.xmax.push(bbox.x + bbox.width);
        coordinates.ymax.push(bbox.y + bbox.height);
      });
      return {
        xmin: Math.min(...coordinates.xmin),
        xmax: Math.max(...coordinates.xmax),
        ymin: Math.min(...coordinates.ymin),
        ymax: Math.max(...coordinates.ymax)
      };
    },
    computeElementsCenter(selection) {
      const { xmin, xmax, ymin, ymax } = this.computeElementsBBox(selection);
      const x = xmin + (xmax - xmin) / 2;
      const y = ymin + (ymax - ymin) / 2;
      return { x, y };
    },
    shadeColor(color, percent) {
      var R = parseInt(color.substring(1, 3), 16);
      var G = parseInt(color.substring(3, 5), 16);
      var B = parseInt(color.substring(5, 7), 16);

      R = parseInt((R * (100 + percent)) / 100);
      G = parseInt((G * (100 + percent)) / 100);
      B = parseInt((B * (100 + percent)) / 100);

      R = R < 255 ? R : 255;
      G = G < 255 ? G : 255;
      B = B < 255 ? B : 255;

      var RR =
        R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
      var GG =
        G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
      var BB =
        B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

      return "#" + RR + GG + BB;
    },
    wrap(d, i) {
      const selection = d3
        .selectAll(`.${d.name.toLowerCase().replace(/[^A-Z0-9]/gi, "_")}`)
        .nodes();
      const bbox = this.computeElementsBBox(selection);
      const width = bbox.xmax - bbox.xmin;
      const text = d3.selectAll(".parent__label").filter((d, ind) => ind == i);
      const words = text
        .text()
        .split(/\s+/)
        .reverse();
      const lineHeight = 1.1;
      const x = text.attr("x");
      const y = text.attr("y");
      const dy = 0;

      let line = [];
      let word;
      let lineNumber = 0;
      let tspan = text
        .text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }

      if (lineNumber > 0) {
        const startDy = -((lineNumber - 1) * lineHeight);
        text
          .selectAll("tspan")
          .attr("dy", (d, i) => startDy + lineHeight * i + "em");
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
  width: 90%;
  height: 30rem;

  @media screen and (min-height: 800px) {
    height: 40rem;
  }

  @media screen and (max-width: 440px) {
    height: 20rem;
  }
}

.treemap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;

  &__buttons {
    transform: translateY(-3.5rem);
  }

  &__year-buttons {
    display: flex;
    justify-content: space-evenly;
    width: 100%;

    button {
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
      background-color: #ddd;
      cursor: pointer;
      border: none;
      padding: 1rem;
      transition: all 0.2s;

      &.selected {
        background-color: var(--color-green-tnc);
        color: #fff;
      }

      &:hover {
        box-shadow: 0 5px 8px rgba(0, 0, 0, 0.4);
        transform: translateY(-2px);
      }
    }
  }
}
</style>
