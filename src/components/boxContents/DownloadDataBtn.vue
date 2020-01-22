<template>
  <button @click="downloadData()" :exportData="exportData">
    Descargar datos
  </button>
</template>
<script>
export default {
  name: "DownloadDataBtn",
  components: {},
  computed: {},
  methods: {
    downloadData() {
      this.exportCSVFile(this.exportData.header, this.exportData.data);
    },
    convertToCSV(objArray) {
      const array =
        typeof objArray != "object" ? JSON.parse(objArray) : objArray;
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
    },
    exportCSVFile(headers, items, filename = "export_datos.csv") {
      if (headers) {
        items.unshift(headers);
      }
      const jsonObject = JSON.stringify(items);
      const csv = this.convertToCSV(jsonObject);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename); // IE 10+
      } else {
        const link = document.createElement("a");
        if (link.download !== undefined) {
          // feature detection
          // Browsers that support HTML5 download attribute
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    }
  },
  props: {
    exportData: {
      type: Object,
      required: true
    }
  }
};
</script>
