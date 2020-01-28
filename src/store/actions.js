export default {
  cambiarProyecto({ commit }, nuevoProyecto) {
    commit("PONER_FILTRO_PROYECTO", nuevoProyecto);
  },
  verTodo({ commit }) {
    commit("RESET_FILTRO");
  },
  changeClassificationScheme({ commit }, classificationScheme) {
    commit("CHANGE_CLASSIFICATION_SCHEME", classificationScheme);
  },
  changeYear({ commit }, yearInfo) {
    commit("CHANGE_YEAR", yearInfo);
  }
}