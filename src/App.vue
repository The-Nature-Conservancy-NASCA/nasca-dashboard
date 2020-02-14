<template>
  <div>
    <Header />
    <BoxContainer v-if="dataLoaded" />
    <div class="loader" v-else>
      <img src="@/assets/images/loader.gif" alt="" />
    </div>
    <div id="tooltip__graph"></div>
  </div>
</template>

<script>
import BoxContainer from "./components/BoxContainer.vue";
import Header from "./components/Header.vue";

import { buildQuery } from "./lib/queryBuilder";

const BASE_DATA_URL =
  "https://services9.arcgis.com/LQG65AprqDvQfUnp/ArcGIS/rest/services/TNCServices4/FeatureServer/";
const ICON_DATA_URL =
  "https://services9.arcgis.com/LQG65AprqDvQfUnp/ArcGIS/rest/services/iconos_biodiversidad/FeatureServer/";

export default {
  name: "app",
  components: {
    Header,
    BoxContainer
  },
  data() {
    return {
      dataLoaded: false
    };
  },
  created() {
    let requests = [];
    requests.push(fetch(`${BASE_DATA_URL}12/${buildQuery()}`)); // Colores Coberturas
    requests.push(fetch(`${ICON_DATA_URL}0/${buildQuery()}`)); // Iconos
    requests.push(fetch(`${BASE_DATA_URL}11/${buildQuery()}`)); // Carbono
    requests.push(fetch(`${BASE_DATA_URL}6/${buildQuery()}`)); // Metas
    requests.push(
      fetch(
        `${BASE_DATA_URL}13/${buildQuery({
          outFields:
            "ID_predio%2C+ID_cobertura%2C+corine1%2C+corine2%2C+cobertura_proyecto%2C+verificacion%2C+fecha_visita%2C+carbono_biomasa%2C+carbono_suelos%2C+carbono_madera%2C+subcobertura_proyecto%2C+area"
        })}`
      )
    ); // Coberturas
    requests.push(fetch(`${BASE_DATA_URL}8/${buildQuery()}`)); // Implementaciones Predios
    requests.push(fetch(`${BASE_DATA_URL}7/${buildQuery()}`)); // Aliados
    requests.push(fetch(`${BASE_DATA_URL}5/${buildQuery()}`)); // Participantes
    requests.push(fetch(`${BASE_DATA_URL}9/${buildQuery()}`)); // Contribuciones
    requests.push(fetch(`${BASE_DATA_URL}3/${buildQuery()}`)); // Estrategias
    requests.push(fetch(`${BASE_DATA_URL}4/${buildQuery()}`)); // Proyectos
    requests.push(
      fetch(
        `${BASE_DATA_URL}1/${buildQuery({
          outFields: "ID_predio%2C+ID_proyecto"
        })}`
      )
    ); // Proyectos
    requests.push(
      fetch(
        `${BASE_DATA_URL}2/${buildQuery({
          outFields:
            "ID_proyecto%2C+grupo_tnc%2C+cobertura%2C+especie%2C+fecha_identificacion"
        })}`
      )
    ); // Biodiversidad
    requests.push(fetch(`${BASE_DATA_URL}0/${buildQuery()}`)); // Regiones
    Promise.all(requests).then(responses => {
      const parsePromises = responses.map(response => response.json());
      Promise.all(parsePromises).then(dataset => {
        this.$store.commit(
          "SET_REGIONES",
          dataset[13].features.map(feature => feature.attributes)
        );
        this.$store.commit(
          "SET_BIODIVERSIDAD",
          dataset[12].features.map(feature => feature.attributes)
        );
        this.$store.commit(
          "SET_COLORES",
          dataset[0].features.map(feature => feature.attributes)
        );
        this.$store.commit(
          "SET_ICONOS",
          dataset[1].features.map(feature => feature.attributes)
        );
        this.$store.commit(
          "SET_CARBONO",
          dataset[2].features.map(feature => feature.attributes)
        );
        this.$store.commit(
          "SET_METAS",
          dataset[3].features.map(feature => feature.attributes)
        );
        this.$store.commit(
          "SET_COBERTURAS",
          dataset[4].features.map(feature => feature.attributes)
        );
        this.$store.commit(
          "SET_IMPLEMENTACIONES",
          dataset[5].features.map(feature => feature.attributes)
        );
        this.$store.commit(
          "SET_ALIADOS",
          dataset[6].features.map(feature => feature.attributes)
        );
        this.$store.commit(
          "SET_PARTICIPANTES",
          dataset[7].features.map(feature => feature.attributes)
        );
        this.$store.commit(
          "SET_CONTRIBUCIONES",
          dataset[8].features.map(feature => feature.attributes)
        );
        this.$store.commit(
          "SET_ESTRATEGIAS",
          dataset[9].features.map(feature => feature.attributes)
        );
        this.$store.commit(
          "SET_PROYECTOS",
          dataset[10].features.map(feature => feature.attributes)
        );
        this.$store.commit(
          "SET_PREDIOS",
          dataset[11].features.map(feature => feature.attributes)
        );
        this.dataLoaded = true;
      });
    });
  }
};
</script>

<style lang="scss">
:root {
  --color-green-tnc: #4aa241;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 62.5%;
}

body {
  font-family: "Roboto", sans-serif;
  font-size: 1.6rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a, a:visited, a:link, a:focus {
   text-decoration: none;
}

#app {
  background-color: rgb(228, 228, 228);
  height: 100vh;
  padding: 0 8rem;
  width: 100vw;
}

.loader {
  align-items: center;
  display: flex;
  height: calc(100vh - 8.2rem);
  justify-content: center;
  width: 100vw;
}

#tooltip__graph {
  position: absolute;
  height: auto;
  padding: 5px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  pointer-events: none;
  display: none;

  .tooltip__title {
    font-weight: bold;
  }

  hr {
    margin: 5px 0;
    border: 0;
    height: 0;
    border-top: 1px solid var(--color-green-tnc);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  }
}

svg {
  rect {
    -moz-transition: all 0.25s;
    -o-transition: all 0.25s;
    -webkit-transition: all 0.25s;
    transition: all 0.25s;
  }
}
</style>
