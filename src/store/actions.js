export default {
  cambiarProyecto({ commit }, nuevoProyecto) {
    commit("PONER_FILTRO_PROYECTO", nuevoProyecto);
  },
  cambiarEstrategia({ commit }, nuevaEstrategia) {
    commit("PONER_FILTRO_ESTRATEGIA", nuevaEstrategia);
  },
  verTodo({ commit }) {
    commit("RESET_FILTRO");
  },
  changeClassificationScheme({ commit }, classificationScheme) {
    commit("CHANGE_CLASSIFICATION_SCHEME", classificationScheme);
  },
  changeCarbonoField({ commit }, field) {
    commit("CHANGE_CARBONO_FIELD", field);
  },
  changeYear({ commit }, yearInfo) {
    commit("CHANGE_YEAR", yearInfo);
  }
};
