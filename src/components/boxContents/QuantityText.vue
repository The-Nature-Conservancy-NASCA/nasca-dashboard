<template>
  <div class="quantity-text">
    <div>
      <span
        v-if="
          otherValue !== undefined && !ignoreDecimalPoints && typeof otherValue === 'number'
        "
        class="quantity-text__value"
        :style="`font-size: ${valueSize}rem;`"
      >
        {{ otherValue.toFixed(decimalPoints).toLocaleString("en") }}
      </span>
      <span
        v-else-if="otherValue !== undefined && ignoreDecimalPoints"
        class="quantity-text__value"
        :style="`font-size: ${valueSize}rem;`"
      >
        {{ otherValue.toLocaleString("en") }}
      </span>
      <span v-if="valueConnector" class="quantity-text__text">{{
        valueConnector
      }}</span>
      <span
        v-if="!ignoreDecimalPoints && typeof value === 'number'"
        class="quantity-text__value"
        :style="`font-size: ${valueSize}rem;`"
      >
        {{ value.toFixed(decimalPoints).toLocaleString("en") }}
      </span>
      <span
        v-else-if="ignoreDecimalPoints || typeof value === 'string'"
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
      required: false
    },
    value: {
      required: false
    },
    unit: {
      type: String,
      required: false
    },
    otherValue: {
      required: false
    },
    valueConnector: {
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
    ignoreDecimalPoints: {
      type: Boolean,
      required: false,
      default: false
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
    color: var(--theme-color);
    font-weight: 300;
    @media screen and (max-width: 768px) {
      font-size: 3.4rem !important;
    }
  }

  &__unit {
    color: var(--theme-color);
    font-weight: 700;
  }
}
</style>
