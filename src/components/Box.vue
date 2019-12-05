<template>
  <section class="box" :style="gridStyle">
    <header class="box__header">{{ box.title }}</header>
    <div class="box__content">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus possimus provident alias quidem dolorem expedita nihil quam eaque repellendus unde veritatis atque iure cum quibusdam nemo ullam doloremque, quae ipsa.</div>
  </section>
</template>
<script>
export default {
  name: "Box",
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
  padding: 1.4rem;

  &__header {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  &__content {
    padding: 5rem 0; //temporal para verse bonito
  }
}
</style>
