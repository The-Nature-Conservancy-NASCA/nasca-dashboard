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
              @click.stop="cambiarProyecto(proyecto.id)"
            >
              {{ proyecto.nombre }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "FiltroEstrategia",
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
  methods: {
    proyectosPorEstrategia(estrategia) {
      return this.$store.getters.proyectosPorEstrategia(estrategia);
    },
    cambiarEstrategia(estrategia) {
      if ("todos" === estrategia) {
        this.verTodo();
      } else {
        this.$store.dispatch("cambiarEstrategia", estrategia);
      }
    },
    cambiarProyecto(proyecto) {
      this.$store.dispatch("cambiarProyecto", proyecto);
    },
    verTodo() {
      this.$store.dispatch("verTodo");
    }
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
</style>
