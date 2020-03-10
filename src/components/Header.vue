<template>
  <div class="header">
    <img
      src="../assets/images/tnc-logo-light.png"
      alt="logo"
      class="header__logo"
    />
    <span class="header__level">{{ currentLevel }}</span>
    <div class="header__estrategias">
      <select
        class="select colombia___or__strategy"
        v-model="momentoSelected"
        @change="changeMoment()"
        v-if="this.$store.state.filtro.modo !== 'proyecto'"
      >
        <option value="0">{{ strings.lineaBase }}</option>
        <option value="99">{{ strings.progreso }}</option>
      </select>
      <select
        class="select project"
        @change="changeMoment()"
        v-model="momentoSelected"
        v-if="this.$store.state.filtro.modo === 'proyecto'"
      >
        <option
          v-for="moment in getProjectMoments(this.$store.state.filtro.valor)"
          :key="moment.name"
          :value="moment.value.toString()"
        >
          {{ moment.name }}
        </option>
      </select>
      <FiltroEstrategia class="header__filtros" />
      <div class="header__ctas">
        <DownloadDataBtn />
        <DownloadImageBtn />
        <a
          href="http://tnc-visor.dreamgis.com/visor.html"
          target="_blank"
          title="Ir al visor TNC"
        >
          <i class="material-icons">
            map
          </i>
        </a>
      </div>
      <div class="divider"></div>
      <div class="header__options">
        <i class="options__icon esri-icon-description" @click="showModal()"></i>
        <span
          @click="cambiarIdioma('es')"
          class="options__language"
          :class="{ selected: idiomaSelected === 'es' }"
        >
          ES
        </span>
        <span
          @click="cambiarIdioma('en')"
          class="options__language"
          :class="{ selected: idiomaSelected === 'en' }"
        >
          EN
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import DownloadDataBtn from "./DownloadDataBtn.vue";
import DownloadImageBtn from "./DownloadImageBtn.vue";
import FiltroEstrategia from "../components/FiltroEstrategia.vue";

export default {
  name: "Header",
  components: {
    DownloadDataBtn,
    DownloadImageBtn,
    FiltroEstrategia
  },
  computed: {
    currentLevel() {
      return this.$store.getters.currentLevel;
    },
    filtroModo() {
      return this.$store.getters.filtro.modo;
    },
    strings() {
      return this.$store.getters.strings;
    }
  },
  data() {
    return {
      estrategiaSelected: "",
      momentoSelected: "99",
      proyectoSelected: "",
      idiomaSelected: "es"
    };
  },
  methods: {
    changeMoment() {
      this.$store.dispatch("changeMoment", this.momentoSelected);
    },
    getProjectMoments(projectId) {
      return this.$store.getters.momentos(projectId);
    },
    getProjectMostRecentMoment(projectId) {
      return this.$store.getters.mostRecentMoment(projectId);
    },
    seleccionarTodo() {
      this.$store.dispatch("verTodo");
    },
    cambiarIdioma(nuevoIdioma) {
      this.idiomaSelected = nuevoIdioma;
      this.$store.dispatch("cambiarIdioma", nuevoIdioma);
    },
    showModal() {
      this.$store.dispatch("showModal");
    }
  },
  watch: {
    filtroModo() {
      if (this.filtroModo === "proyecto") {
        const projectId = this.$store.getters.filtro.valor;
        const moment = this.getProjectMostRecentMoment(projectId);
        this.momentoSelected = moment;
        this.changeMoment(moment);
      } else {
        this.momentoSelected = "99";
        this.changeMoment("99");
      }
    }
  }
};
</script>

<style scoped lang="scss">
$font-gray: #999;
$font-dark: #333;

@mixin dark-hover {
  transition: color 0.3s;

  &:hover {
    color: $font-dark;
  }
}
.header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 2rem;

  &__estrategias {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    width: 30vw;

    @media screen and (max-width: 1280px) {
      width: 40vw;
    }

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }

  &__ctas {
    display: flex;
    justify-content: space-between;

    a {
      margin: 0 0.5rem;
    }
  }

  &__logo {
    width: 15rem;
    margin-right: 2rem;

    @media screen and (min-width: 901px) and (max-width: 1280px) {
      width: 15rem;
    }

    @media screen and (max-width: 768px) {
      margin-bottom: 2rem;
      margin-right: 0;
      margin-top: 40px;
      flex: 1;
    }
  }

  button {
    background-color: transparent;
    border: none;
    color: $font-gray;
    cursor: pointer;
    font-size: 1.6rem;
    padding: 2rem;
    transition: color 0.3s;

    &:hover {
      color: #666;
    }
  }

  &__options {
    align-items: center;
    display: flex;
    justify-content: space-evenly;
  }

  .divider {
    background-color: $font-gray;
    height: 3rem;
    width: 2px;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;

    &__filtros {
      position: absolute;
    }

    &__level {
      margin-bottom: 1rem;
      font-size: 2rem;
    }

    .divider {
      display: none;
    }
  }

  @media screen and (max-height: 768px) {
    padding: 1rem 2rem;
  }

  .select {
    border: none;
    border-radius: 0;
    background-color: #fff;
    border-bottom: 2px solid var(--theme-color);
  }
}

.options {
  &__icon {
    @include dark-hover;
    cursor: pointer;
    font-size: 2rem;
    color: $font-gray;
    margin-right: 1.5rem;

    &:last-child {
      margin-right: 0;
    }
  }

  &__language {
    @include dark-hover;
    color: $font-gray;
    cursor: pointer;
    margin-right: 1.5rem;

    &.selected {
      font-weight: 700;
    }
  }
}
</style>
