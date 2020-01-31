<template>
  <a @click="downloadImages()" title="Descargar imagenes">
    <i class="material-icons">
      image
    </i>
  </a>
</template>
<script>
import * as JSZip from "jszip";
import { saveAs } from "file-saver";
import { svgAsPngUri } from "save-svg-as-png";

export default {
  name: "DownloadImageBtn",
  components: {},
  computed: {},
  methods: {
    downloadImages() {
      const options = { backgroundColor: "white" };
      const svgElements = document.getElementsByClassName("graph");
      const promises = [];
      const names = [];
      const zip = new JSZip();
      svgElements.forEach(el => {
        promises.push(svgAsPngUri(el, options));
        names.push(el.id);
      });
      Promise.all(promises).then(uris => {
        uris.forEach((uri, i) => {
          const data = this.dataURLtoBase64(uri);
          zip.file(`${names[i]}.png`, data, { base64: true });
        });
        zip.generateAsync({ type: "blob" }).then(blob => {
          saveAs(blob, "img.zip");
        });
      });
    },
    dataURLtoBase64(dataurl) {
      let arr = dataurl.split(","),
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return u8arr;
    }
  }
};
</script>
<style lang="scss" scoped>
a {
  cursor: pointer;

  .material-icons {
    color: #999;
    transition: color 0.3s;

    &:hover {
      color: #666;
    }
  }
}
</style>
