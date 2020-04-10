<template>
  <section ref="graph" class="graph__container"></section>
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

      // compute width and height based on parent div
      this.parentWidth =
        parseInt(this.el.style("width")) -
        parseInt(this.el.style("padding-left")) -
        parseInt(this.el.style("padding-right"));
      this.parentHeight =
        parseInt(this.el.style("height")) -
        parseInt(this.el.style("padding-top")) -
        parseInt(this.el.style("padding-bottom"));
      this.width = this.parentWidth - this.margin.left - this.margin.right;
      this.height = this.parentHeight - this.margin.top - this.margin.bottom;

      this.tooltipOffset = 15;
      this.fontSize;
      if (screen.height <= 768) {
        this.fontSize = "10px";
      } else if (screen.width > 900 && screen.width <= 1280) {
        this.fontSize = "12px";
      } else {
        this.fontSize = "14px";
      }

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
        .padding(0)
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
              .attr("fill-opacity", 0.05)
              .attr("stroke-opacity", 0.1);
            treemapGroup
              .selectAll(`rect.${that.cleanString(d.parent.data.name)}`)
              .attr("fill-opacity", 0.6)
              .attr("stroke-opacity", 1);
            treemapGroup
              .selectAll("text")
              .filter(function() {
                return (
                  d3.select(this).attr("id") !==
                  that.cleanString(d.parent.data.name)
                );
              })
              .attr("fill", "black")
              .attr("fill-opacity", 0.4)
              .attr("font-weight", "normal")
              .style("text-shadow", "none");
            d3.select(this)
              .attr("stroke-width", 1.5)
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
              .attr("fill-opacity", 0.8)
              .attr("stroke-opacity", 1)
              .attr("stroke-width", 0.5);
            treemapGroup
              .selectAll("text")
              .attr("visibility", "visible")
              .attr("fill", d =>
                that.pickTextColorBasedOnBgColorAdvanced(d.children[0].color)
              )
              .attr("fill-opacity", 1)
              .attr("font-weight", "bold")
              .style(
                "text-shadow",
                d =>
                  `0 0 6px ${that.pickShadowColorBasedOnBgColorAdvanced(
                    d.children[0].color
                  )}, 0 0 3px ${that.pickShadowColorBasedOnBgColorAdvanced(
                    d.children[0].color
                  )}`
              );
            d3.select("#tooltip__graph")
              .html("")
              .style("display", "none");
          })
          .attr("x", d => d.x0)
          .attr("y", d => d.y0)
          .attr("fill", d => d.data.color)
          .attr("fill-opacity", 0.8)
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
          .attr("font-size", this.fontSize)
          .attr("fill", d =>
            this.pickTextColorBasedOnBgColorAdvanced(d.children[0].color)
          )
          .attr("fill-opacity", 1)
          .attr("font-weight", "bold")
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
          .style(
            "text-shadow",
            d =>
              `0 0 6px ${this.pickShadowColorBasedOnBgColorAdvanced(
                d.children[0].color
              )}, 0 0 3px ${this.pickShadowColorBasedOnBgColorAdvanced(
                d.children[0].color
              )}`
          )
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
    pickShadowColorBasedOnBgColorAdvanced(bgColor) {
      var color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
      var r = parseInt(color.substring(0, 2), 16); // hexToR
      var g = parseInt(color.substring(2, 4), 16); // hexToG
      var b = parseInt(color.substring(4, 6), 16); // hexToB
      var uicolors = [r / 255, g / 255, b / 255];
      var c = uicolors.map(col => {
        if (col <= 0.03928) {
          return col / 12.92;
        }
        return Math.pow((col + 0.055) / 1.055, 2.4);
      });
      var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
      return L > 0.179 ? "#ffffff" : "#000000";
    },

    pickTextColorBasedOnBgColorAdvanced(bgColor) {
      var color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
      var r = parseInt(color.substring(0, 2), 16); // hexToR
      var g = parseInt(color.substring(2, 4), 16); // hexToG
      var b = parseInt(color.substring(4, 6), 16); // hexToB
      var uicolors = [r / 255, g / 255, b / 255];
      var c = uicolors.map(col => {
        if (col <= 0.03928) {
          return col / 12.92;
        }
        return Math.pow((col + 0.055) / 1.055, 2.4);
      });
      var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
      return L > 0.179 ? "#000000" : "#ffffff";
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
        const startDy = -(lineNumber * (lineHeight / 2));
        text
          .selectAll("tspan")
          .attr("dy", (d, i) => startDy + lineHeight * i + "em");
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
<style lang="scss" scoped>
.graph__container {
  width: 100%;
  height: 100%;
  padding: 1rem;
}
</style>
