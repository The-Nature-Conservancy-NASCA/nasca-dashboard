<template>
  <div class="quantity-text">
    <h4 class="quantity-text__value" :style="`font-size: ${valueSize}rem;`">
      {{ value | removeDecimal(decimalPoints) }}
    </h4>
    <h4 class="quantity-text__text" :style="`font-size: ${textSize}rem;`">
      {{ name }}
    </h4>
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
    textSize: {
      type: String,
      required: false,
      default: "1.4"
    },
    valueSize: {
      type: String,
      required: false,
      default: "3"
    },
    decimalPoints: {
      type: Number,
      required: false,
      default: 0
    }
  },
  filters: {
    removeDecimal(value, decimalPoints) {
      return typeof value == "number"
        ? value.toFixed(decimalPoints)
        : value;
    }
  }
};
</script>
<style lang="scss" scoped>
.quantity-text {
  text-align: center;

  &__text {
    color: #666;
    //font-size: 1.4rem;
    //text-transform: uppercase;
  }

  &__value {
    color: var(--color-green-tnc);
    //font-size: 3rem;
  }
}
</style>
