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
  data() {
    return {
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
    downloadData() {
      const data = {
        carbono: this.$store.getters.carbonoExport,
        coberturas: this.$store.getters.coberturasExport,
        implementaciones: this.$store.getters.implementacionesExport,
        participantes: this.$store.getters.participantesExport
      };
      this.$store.getters.biodiversidad.forEach(group => {
        data[
          `biodiversidad_${group.name.toLowerCase()}`
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
        const value = this.$store.getters.filtro.valor;
        const moment = this.$store.getters.filtro.moment;
        saveAs(
          blob,
          `datos_${this.mapValores[value]}_${this.mapMomentos[moment]}.zip`
        );
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
