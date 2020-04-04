<template>
  <div class="metas">
    <carousel
      :perPage="1"
      :scrollPerPage="false"
      :paginationEnabled="false"
      :navigationEnabled="true"
      :navigationClickTargetSize="3"
      :navigationPrevLabel="'&#8249;'"
      :navigationNextLabel="'&#8250;'"
    >
      <slide v-for="meta in metas" :key="meta.OBJECTID">
        <QuantityText
          :name="meta.meta"
          :value="meta.valor"
          :unit="meta.unidad"
          :ignoreDecimalPoints="true"
        />
      </slide>
    </carousel>
  </div>
</template>
<script>
import QuantityText from "./QuantityText.vue";
import { Carousel, Slide } from "vue-carousel";

export default {
  name: "Metas",
  components: {
    Carousel,
    QuantityText,
    Slide
  },
  computed: {
    metas() {
      return this.$store.getters.metas;
    }
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.metas {
  .VueCarousel {
    width: 80%;
    margin: auto;

    &-navigation-button {
      font-size: 20px;
    }
  }
}
</style>
