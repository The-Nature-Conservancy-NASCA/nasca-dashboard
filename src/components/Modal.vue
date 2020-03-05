<template>
  <div class="modal" :class="{ 'modal--visible': visible }">
    <div class="modal__overlay" @click.stop="hideModal()">
      <div class="modal-popup">
        <header class="modal-popup__header">
          {{ header }}
        </header>
        <div class="modal-popup__content">
          <span v-html="content"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Modal",
  computed: {
    visible() {
      return this.$store.state.modalVisible;
    },
    header() {
      return this.$store.getters.strings.informacion;
    },
    content() {
      return this.$store.getters.strings.infoContent;
    }
  },
  methods: {
    hideModal() {
      this.$store.dispatch("hideModal");
    }
  }
};
</script>
<style lang="scss">
.modal {
  opacity: 0;
  visibility: hidden;

  &--visible {
    opacity: 1;
    visibility: visible;
  }
}

.modal__overlay {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 15;
}

.modal-popup {
  background-color: #fff;
  border-top: 5px solid var(--theme-color);
  max-width: 500px;
  z-index: 16;

  &__header {
    width: 100%;
    font-size: 2.5rem;
    text-align: center;
    padding: 1.6rem;
    font-weight: 100;
  }

  &__content {
    padding: 2rem;

    > *:not(:last-child) {
      margin-bottom: 4rem;
    }
  }

  p {
    line-height: 1.6;
    font-size: 1.4rem;
  }

  .images {
    &--centered {
      align-items: center;
      display: flex;
      justify-content: space-evenly;
    }
  }
}
</style>
