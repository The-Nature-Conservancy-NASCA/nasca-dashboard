<template>
  <a @click="downloadImages()" :title="strings.descargarImagenes">
    <i class="material-icons">
      image
    </i>
  </a>
</template>
<script>
import * as JSZip from "jszip";
import { saveAs } from "file-saver";
// import { svgAsPngUri } from "save-svg-as-png";
// import * as html2canvas from "html2canvas";
import domtoimage from "dom-to-image";

export default {
  name: "DownloadImageBtn",
  components: {},
  computed: {
    strings() {
      return this.$store.getters.strings;
    }
  },
  data() {
    return {
      boxContents: [
        "coberturas",
        "biodiversidad",
        "implementaciones",
        "carbono"
      ],
      exportOptions: {
        filter: this.filterElements,
        style: {
          borderRight: "1px solid lightGray",
          borderLeft: "1px solid lightGray",
          borderBottom: "1px solid lightGray",
          overflow: "hidden"
        }
      },
      mapValores: {
        null: "colombia",
        "01": "aguas",
        "02": "tierras",
        "03": "infraestructura",
        "01AB": "ganaderia",
        "02BC": "agroforesteria"
      },
      mapMomentos: {
        "0": "linea_base",
        "1": "seguimiento1",
        "2": "seguimiento2",
        "3": "cierre",
        "99": "estado_actual"
      }
    };
  },
  methods: {
    downloadImages() {
      const zip = new JSZip();
      const promises = [];
      this.boxContents.forEach(boxContent => {
        if (boxContent === "carbono") {
          if (this.$store.getters.filtro.modo !== "proyecto") {
            return;
          }
        }
        const box = document.querySelector(`#box__${boxContent}`);
        const promise = domtoimage.toJpeg(box, this.exportOptions);
        promises.push(promise);
      });
      Promise.all(promises).then(results => {
        results.forEach((dataURL, i) => {
          const data = this.dataURLtoBase64(dataURL);
          zip.file(`${this.boxContents[i]}.jpg`, data, { base64: true });
        });
        const value = this.$store.getters.filtro.valor;
        const moment = this.$store.getters.filtro.moment;
        zip.generateAsync({ type: "blob" }).then(blob => {
          saveAs(
            blob,
            `imagenes_${this.mapValores[value]}_${this.mapMomentos[moment]}.zip`
          );
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
    },
    filterElements(node) {
      let keepNode = true;
      if (node.tagName) {
        const tagName = node.tagName.toLowerCase();
        if (tagName === "button" || tagName === "i") {
          keepNode = false;
        }
      }
      return keepNode;
    }
  }
};
</script>
