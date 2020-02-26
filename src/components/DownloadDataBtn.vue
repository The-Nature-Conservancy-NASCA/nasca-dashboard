<template>
  <a @click="downloadData()" :title="strings.descargarDatos">
    <i class="material-icons">
      assignment_returned
    </i>
  </a>
</template>
<script>
import * as JSZip from "jszip";
import { saveAs } from "file-saver";

export default {
  name: "DownloadDataBtn",
  components: {},
  computed: {
    cobertura() {
      return this.$store.getters.cob;
    },
    strings() {
      return this.$store.getters.strings;
    }
  },
  methods: {
    downloadData() {
      const data = {
        carbono: this.$store.getters.carbonoExport,
        coberturas: this.$store.getters.coberturasExport,
        implementaciones: this.$store.getters.implementacionesExport,
        participantes: this.$store.getters.participantesExport
      };
      this.$store.getters.gruposBiodiversidad.forEach(group => {
        data[
          `biodiversidad_${group}`
        ] = this.$store.getters.biodiversidadExport(group);
      });
      const zip = new JSZip();
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          const csv = this.arrayToCSVString(data[key].header, data[key].data);
          zip.file(`${key}.csv`, csv);
        }
      }
      zip.generateAsync({ type: "blob" }).then(blob => {
        saveAs(blob, "data.zip");
      });
    },
    arrayToCSVString(header, items) {
      if (header) {
        items.unshift(header);
      }
      const jsonObject = JSON.stringify(items);
      const array =
        typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;
      let str = "";
      for (let i = 0; i < array.length; i++) {
        let line = "";
        for (let index in array[i]) {
          if (line != "") line += ",";
          line += array[i][index];
        }
        str += line + "\r\n";
      }
      return str;
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
