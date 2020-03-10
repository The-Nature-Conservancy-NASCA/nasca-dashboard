<template>
  <div>
    <div class="filtro">
      <a class="toggle" href="#">{{ strings.estrategias }}</a>
      <ul class="filtro__estrategias">
        <li
          class="filtro__estrategia-item selector"
          v-for="estrategia in estrategias"
          :key="estrategia.id"
          :style="`border-left: 3px solid ${estrategia.color}`"
          @click.stop="cambiarEstrategia(estrategia.id)"
        >
          {{ estrategia.nombre }}
          <ul
            class="filtro__proyectos"
            v-if="proyectosPorEstrategia(estrategia.id).length !== 0"
          >
            <li
              class="filtro__proyecto-item selector"
              v-for="proyecto in proyectosPorEstrategia(estrategia.id)"
              :key="proyecto.id"
              :style="`border-left: 3px solid ${proyecto.color}`"
              @click.stop="cambiarProyecto(estrategia.id, proyecto.id)"
            >
              {{ proyecto.nombre }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="acordion" :class="{ 'acordion--visible': scrolled }">
      <span class="acordion__toggle" @click="toggleAcordion()">
        <i class="material-icons">menu</i>
      </span>
      <div class="acordion__menu" :class="{ open: acordionOpen }">
        <ul class="acordion__estrategias">
          <li
            class="acordion__estrategia-item selector"
            v-for="estrategia in estrategias"
            :key="estrategia.id"
            :style="`border-left: 10px solid ${estrategia.color}`"
            @click.stop="cambiarEstrategia(estrategia.id)"
          >
            {{ estrategia.nombre }}
            <ul
              class="acordion__proyectos"
              :class="{ open: estrategiaSelected === estrategia.id }"
              v-if="proyectosPorEstrategia(estrategia.id).length !== 0"
            >
              <li
                class="acordion__proyecto-item selector"
                v-for="proyecto in proyectosPorEstrategia(estrategia.id)"
                :key="proyecto.id"
                :style="`border-left: 5px solid ${proyecto.color}`"
                @click.stop="cambiarProyecto(estrategia.id, proyecto.id)"
              >
                {{ proyecto.nombre }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "FiltroEstrategia",
  data() {
    return {
      scrolled: false,
      acordionOpen: false,
      estrategiaSelected: undefined
    };
  },
  computed: {
    estrategias() {
      const todos = {
        id: "todos",
        nombre: this.strings.verTodo,
        color: "#000"
      };
      return [todos, ...this.$store.getters.estrategias];
    },
    strings() {
      return this.$store.getters.strings;
    }
  },
  created() {
    window.addEventListener("scroll", this.scroll);
  },
  methods: {
    proyectosPorEstrategia(estrategia) {
      const todos = {
        id: "todos",
        nombre: this.strings.verTodo,
        color: "#000"
      };
      const proyectos = this.$store.getters.proyectosPorEstrategia(estrategia);
      return proyectos.length !== 0 ? [todos, ...proyectos] : proyectos;
    },
    cambiarEstrategia(estrategia) {
      if (this.proyectosPorEstrategia(estrategia).length !== 0) {
        this.estrategiaSelected = estrategia;
        return;
      }

      if ("todos" === estrategia) {
        this.verTodo();
      } else {
        this.$store.dispatch("cambiarEstrategia", estrategia);
      }

      if (this.acordionOpen) {
        this.acordionOpen = false;
        this.estrategiaSelected = undefined;
      }
    },
    cambiarProyecto(estrategia, proyecto) {
      if ("todos" === proyecto) {
        this.$store.dispatch("cambiarEstrategia", estrategia);
      } else {
        this.$store.dispatch("cambiarProyecto", proyecto);
      }
      if (this.acordionOpen) {
        this.acordionOpen = false;
        this.estrategiaSelected = undefined;
      }
    },
    verTodo() {
      this.$store.dispatch("verTodo");
    },
    scroll() {
      this.scrolled = window.scrollY > 0;
    },
    toggleAcordion() {
      this.acordionOpen = !this.acordionOpen;
    }
  },
  destroyed() {
    window.removeEventListener("scroll", this.scroll);
  }
};
</script>
<style lang="scss" scoped>
.filtro {
  position: relative;

  .toggle {
    color: #999;

    &:link,
    &:visited {
      text-decoration: none;
    }

    &:hover {
      color: #666;
    }
  }

  &__estrategias {
    background-color: white;
    box-shadow: 0 5px 10px rgba(black, 0.4);
    max-height: 0;
    position: absolute;
    opacity: 0;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    transform-origin: top;
    z-index: 2;
    width: 15rem;
  }

  &__proyectos {
    background-color: white;
    box-shadow: 0 5px 10px rgba(black, 0.4);
    max-height: 0;
    position: absolute;
    transition: all 0.3s ease-in-out;
    z-index: 3;
    left: 15rem;
    width: 22.5rem;
    overflow: hidden;
    transform: translateY(-29px);
  }

  &__estrategia-item:hover .filtro__proyectos {
    max-height: 100rem;
  }

  .selector {
    cursor: pointer;
    padding: 1rem 2rem;
    list-style: none;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      background-color: #ccc;
    }
  }

  &:hover .filtro__estrategias {
    max-height: 100rem;
    overflow: visible;
    opacity: 1;
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
}

.acordion {
  height: 4.5rem;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 99;

  &--visible {
    background-color: #fff;
    box-shadow: 0 3px 5px rgba(black, 0.2);
  }

  &__toggle {
    position: fixed;
    top: 5px;
    left: 5px;
    color: #444;

    i {
      font-size: 3.5rem;
    }
  }

  &__menu {
    background-color: #fff;
    border-top: 1px solid #ccc;
    box-shadow: 0 8px 10px rgba(black, 0.4);
    left: 0;
    max-height: 0;
    overflow: hidden;
    position: relative;
    top: 45px;
    transition: max-height 0.3s ease-in-out;
    width: 100vw;

    &.open {
      max-height: 100vh;
      height: auto;
    }
  }

  &__estrategia-item,
  &__proyecto-item {
    font-size: 1.8rem;
    list-style: none;
    padding: 2rem 1rem;
    border: none;

    &:not(:last-child) {
      border-bottom: 1px solid #ccc;
    }
  }

  &__proyectos {
    max-height: 0;
    overflow: hidden;
    position: relative;
    transition: max-height 0.3s ease-in-out;

    &.open {
      max-height: 100vh;
      height: auto;
    }
  }

  &__proyecto-item {
    font-size: 1.4rem;
  }

  &__proyectos {
    position: relative;
    top: 2rem;
    left: -1rem;
  }

  @media screen and (min-width: 1024px) {
    display: none;
  }
}
</style>
