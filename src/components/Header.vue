<template>
  <div class="header">
    <img
      src="../assets/images/tnc-logo-light.png"
      alt="logo"
      class="header__logo"
    />
    <div class="header__estrategias">
      <span>{{ currentLevel }}</span>
      <select
        class="select colombia___or__strategy"
        @change="changeMoment($event)"
        v-if="this.$store.state.filtro.modo !== 'proyecto'"
      >
        <option value="0" selected>Línea base</option>
        <option value="99">Estado actual</option>
      </select>
      <select
        class="select project"
        @change="changeMoment($event)"
        v-if="this.$store.state.filtro.modo === 'proyecto'"
      >
        <option
          v-for="moment in getProjectMoments(this.$store.state.filtro.valor)"
          :key="moment.name"
          :value="moment.value"
        >
          {{ moment.name }}
        </option>
      </select>
      <FiltroEstrategia />
      <button @click="seleccionarTodo">Ver todo</button>
      <DownloadDataBtn />
      <DownloadImageBtn />
      <div class="divider"></div>
      <div class="header__options">
        <i class="options__icon esri-icon-description js-show-general-info"></i>
        <a href="#"><span class="options__language selected">ES</span></a>
        <a href="./en/visor.html"><span class="options__language">EN</span></a>
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
    }
  },
  data() {
    return {
      estrategiaSelected: "",
      proyectoSelected: ""
    };
  },
  methods: {
    changeMoment(event) {
      this.$store.dispatch("changeMoment", event.target.value);
    },
    getProjectMoments(projectId) {
      return this.$store.getters.momentos(projectId);
    },
    seleccionarTodo() {
      this.$store.dispatch("verTodo");
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
  }

  &__logo {
    width: 15rem;
    margin-right: 2rem;
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
    margin-right: 1.5rem;
    margin-left: 1.5rem;
    width: 2px;
  }

  @media screen and (min-width: 901px) and (max-width: 1280px) {
    &__logo {
      width: 15rem;
    }
  }

  @media screen and (max-width: 440px) {
    flex-wrap: wrap;
    justify-content: center;
  }

  @media screen and (max-height: 768px) {
    padding: 1rem 2rem;
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
