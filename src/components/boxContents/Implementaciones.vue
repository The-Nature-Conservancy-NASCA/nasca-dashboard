<template>
  <div class="width-100">
    <i class="box__icon esri-icon-description" @click="showModal()"></i>
    <div class="implementaciones" v-if="implementaciones.length">
      <BarChart
        :graphData="implementaciones"
        :graphId="'barchart__implementaciones'"
        :xlabel="strings.implementacionesXLabel"
        :ylabel="strings.implementacionesYLabel"
        :dataDomainUpperBound="domainUpperBoundImplementaciones"
      />
    </div>
    <div v-else class="no__data__warning">
      <p>{{ strings.noHayDatos }}</p>
    </div>
  </div>
</template>
<script>
import BarChart from "./BarChart.vue";
export default {
  name: "Implementaciones",
  components: {
    BarChart
  },
  computed: {
    domainUpperBoundImplementaciones() {
      return this.$store.getters.domainUpperBoundImplementaciones;
    },
    implementaciones() {
      return this.$store.getters.implementaciones;
    },
    strings() {
      return this.$store.getters.strings;
    }
  },
  methods: {
    showModal() {
      const modalContent = {
        header: this.$parent.box.title,
        content: this.$store.getters.panelDescription(
          this.$options.name.toLocaleLowerCase()
        )
      };
      this.$store.dispatch("showModal", modalContent);
    }
  }
};
</script>
<style lang="scss" scoped>
.implementaciones {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  width: 100%;
}
</style>
