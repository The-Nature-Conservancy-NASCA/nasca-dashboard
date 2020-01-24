<template>
  <section class="treemap">
    <div class="treemap__buttons">
      <button>Proyecto</button>
      <button>Corine</button>
    </div>
    <div ref="graph" class="graph__container"></div>
    <div id="tooltip__treemap" class="tooltip__graph"></div>
    <div class="treemap__year-buttons">
      <button
        v-for="year in years"
        :key="year"
        @click="changeYear(year)"
        :class="buttonClass(year)"
      >
        {{ year }}
      </button>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.graph__container {
  width: 50rem;
  height: 20rem;
  margin-top: -3.5rem;
}

.treemap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

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
<script>
import * as d3 from "d3";

export default {
  name: "Treemap",
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
  computed: {
    years() {
      return this.graphData.years;
    },
    selectedYear() {
      return this.$store.getters.filtro.year;
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
      // console.log(this.graphData);
      this.el = d3.select(this.$refs["graph"]);
      this.el.html("");
      if (!this.graphData.children.length) {
        return;
      }
      this.margin = { top: 10, right: 0, bottom: 10, left: 0 };
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
        .attr("class", "treemap")
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
          .on("mouseover", function(d) {
            treemapGroup.selectAll("rect").attr("fill-opacity", 0.3);
            d3.select(this)
              .attr("stroke", "black")
              .attr("stroke-width", 1)
              .attr("fill-opacity", 0.75);
            const coordinates = [d3.event.pageX, d3.event.pageY];
            const tooltipContent = `
                <span class="tooltip__title">${d.parent.data.name}</span><br>
                <span class="tooltip__subtitle">${
                  d.data.name
                }</span>: <span class="tooltip__value">${Math.round(
              d.data.value
            )} ha</span>
              `;
            d3.select("#tooltip__treemap")
              .style("left", `${coordinates[0] + that.tooltipOffset}px`)
              .style("top", `${coordinates[1]}px`)
              .style("display", "block")
              .style("font-size", "11px")
              .html(tooltipContent);
          })
          .on("mousemove", function() {
            const coordinates = [d3.event.pageX, d3.event.pageY];
            d3.select("#tooltip__treemap")
              .style("left", `${coordinates[0] + that.tooltipOffset}px`)
              .style("top", `${coordinates[1]}px`);
          })
          .on("mouseout", function() {
            treemapGroup
              .selectAll("rect")
              .attr("fill-opacity", 0.75)
              .attr("stroke-width", 0.25)
              .attr("stroke", "gray");
            d3.select("#tooltip__treemap").style("display", "none");
          })
          .attr("x", d => d.x0)
          .attr("y", d => d.y0)
          .attr("fill-opacity", 0.75)
          .attr("fill", d => d.data.color)
          .attr("stroke-width", 0.25)
          .attr("stroke", "gray")
          .attr("width", d => d.x1 - d.x0)
          .attr("height", d => d.y1 - d.y0);
      } catch (error) {
        console.log(error);
      }
    },
    buttonClass(year) {
      return {
        selected: this.selectedYear === year,
        unselected: this.selectedYear !== year
      };
    }
  },
  mounted() {
    this.$store.dispatch("changeYear", this.graphData.years.slice(-1)[0]);
    this.render();
  }
};
</script>
