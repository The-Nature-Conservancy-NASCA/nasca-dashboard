<template>
  <section class="box" :style="gridStyle">
    <header class="box__header">
      <span class="box__title"> {{ box.title }}</span>
      <span v-show="box.subtitle" class="box__subtitle">
        {{ box.subtitle }}</span
      >
    </header>
    <div class="box__content">
      <component :is="box.content" />
    </div>
  </section>
</template>
<script>
import * as components from "./boxContents";

export default {
  name: "Box",
  components,
  props: {
    box: {
      type: Object,
      required: true
    }
  },
  computed: {
    gridStyle() {
      const colSpan = this.box.colSpan
        ? this.box.position.y + this.box.colSpan
        : null;
      const rowSpan = this.box.rowSpan
        ? this.box.position.x + this.box.rowSpan
        : null;
      return {
        gridColumn: `${this.box.position.y} / ${
          colSpan ? colSpan : this.box.position.y + 1
        }`,
        gridRow: `${this.box.position.x} / ${
          rowSpan ? rowSpan : this.box.position.x + 1
        }`
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.box {
  background-color: #fff;
  border-top: 3px solid var(--color-green-tnc);
  box-shadow: 0 3px 5px rgba(black, 0.4);
  overflow: hidden;

  &__header {
    padding: 0.5rem;
  }

  &__title {
    color: black;
    font-size: 1.6rem;
    font-weight: 400;
    text-transform: uppercase;
  }

  &__subtitle {
    font-size: 1.2rem;
    margin-left: 7px;
    padding-left: 7px;
    font-weight: 300;
    border-left: 1px solid black;
  }

  &__content {
    align-items: center;
    display: flex;
    justify-content: center;
    height: calc(100% - 3rem);
    width: 100%;
  }
}
</style>
