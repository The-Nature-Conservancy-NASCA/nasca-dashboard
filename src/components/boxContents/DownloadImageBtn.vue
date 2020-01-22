<template>
  <button @click="downloadImage()" :graphId="graphId">Descargar imagen</button>
</template>
<script>
import { saveSvgAsPng } from "save-svg-as-png";

export default {
  name: "DownloadImageBtn",
  components: {},
  computed: {},
  methods: {
    downloadImage() {
      saveSvgAsPng(
        document.getElementById(this.graphId),
        `${this.graphId}.png`
      );
    }
  },
  props: {
    graphId: {
      type: String,
      required: true
    }
  }
};
</script>
