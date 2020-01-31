<template>
  <div class="biodiversidad">
    <div v-for="group in Object.keys(groups)" :key="group">
      <h5>{{ group }}</h5>
      <h4>{{ count(group) }}</h4>
    </div>
  </div>
</template>
<script>
export default {
  name: "Carbono",
  computed: {
    groups() {
      return this.$store.getters.gruposParticipantes;
    }
  },
  methods: {
    count(group) {
      return this.groups[group];
    }
  }
};
</script>
