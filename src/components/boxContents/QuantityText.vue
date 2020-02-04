<template>
  <div class="container">
    <h4>{{ name }}</h4>
    <h4>{{ value }}</h4>
  </div>
</template>
<script>
export default {
  name: "QuantityText",
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    icon: {
      type: String
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  text-align: center;

  h4 {
    color: #666;
    font-size: 1.8rem;
    text-transform: uppercase;
  }

  h5 {
    font-size: 1.6rem;
  }
}
</style>
