<template>
  <div class="metas">
    <i class="box__icon esri-icon-description" @click="showModal()"></i>
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
          :name="meta.name"
          :value="meta.value"
          :unit="meta.unit"
          :otherValue="meta.progress"
          :valueConnector="strings.conectorValoresMetas"
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
    },
    strings() {
      return this.$store.getters.strings;
    }
  },
  methods: {
    showModal() {
      const modalContent = {
        header:  this.$parent.box.title,
        content: "Lorem ipsum Metas"
      }
      this.$store.dispatch("showModal", modalContent);
    }
  }
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
