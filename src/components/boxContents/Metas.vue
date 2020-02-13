<template>
  <div class="metas">
    <div ref="slider" class="swipe">
      <div class="swipe-wrap">
        <div v-for="meta in metas" :key="meta.OBJECTID">
          <QuantityText
            :name="meta.meta"
            :value="meta.valor"
            :unit="meta.unidad"
            :removeDecimals="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import QuantityText from "./QuantityText.vue";
import * as Swipe from "swipejs";

export default {
  name: "Metas",
  components: {
    QuantityText
  },
  computed: {
    metas() {
      return this.$store.getters.metas;
    }
  },
  methods: {},
  mounted() {
    const element = this.$refs["slider"];
    window.mySwipe = new Swipe(element, {
      startSlide: 0,
      auto: 3000,
      draggable: false,
      autoRestart: false,
      continuous: true,
      disableScroll: true,
      stopPropagation: true
    });
  }
};
</script>
<style lang="scss" scoped>
.swipe {
  overflow: hidden;
  visibility: hidden;
  position: relative;

  &-wrap {
    overflow: hidden;
    position: relative;
  }

  &-wrap > div {
    float: left;
    width: 100%;
    position: relative;
  }
}
</style>
