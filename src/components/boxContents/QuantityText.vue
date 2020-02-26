<template>
  <div class="quantity-text">
    <div>
      <span
        v-if="removeDecimals"
        class="quantity-text__value"
        :style="`font-size: ${valueSize}rem;`"
      >
        {{ value | removeDecimal(decimalPoints) }}
      </span>
      <span
        v-else
        class="quantity-text__value"
        :style="`font-size: ${valueSize}rem;`"
      >
        {{ value.toLocaleString("en") }}
      </span>
      <span
        v-if="unit"
        class="quantity-text__unit"
        :style="`font-size: ${unitSize}rem;`"
      >
        {{ unit }}
      </span>
    </div>
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
      type: [Number, String],
      required: true
    },
    unit: {
      type: String,
      required: false
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
    unitSize: {
      type: String,
      required: false,
      default: "1.2"
    },
    decimalPoints: {
      type: Number,
      required: false,
      default: 0
    },
    removeDecimals: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  filters: {
    removeDecimal(value, decimalPoints) {
      if (typeof value === "number") {
        return Number(value.toFixed(decimalPoints)).toLocaleString("en");
      } else {
        return value;
      }
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
    font-weight: 300;
  }

  &__unit {
    color: var(--color-green-tnc);
    font-weight: 700;
  }
}
</style>
