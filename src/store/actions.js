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
  changeAllyType({ commit }, type) {
    commit("CHANGE_ALLY_TYPE", type);
  },
  changeContributionType({ commit }, type) {
    commit("CHANGE_CONTRIBUTION_TYPE", type);
  },
  changeMoment({ commit }, moment) {
    commit("CHANGE_MOMENT", moment);
  },
  changeYear({ commit }, yearInfo) {
    commit("CHANGE_YEAR", yearInfo);
  },
  cambiarIdioma({ commit }, idioma) {
    commit("CHANGE_LANGUAGE", idioma);
  },
  changeBoxSubtitle({ commit }, boxInfo) {
    commit("CHANGE_BOX_SUBTITLE", boxInfo);
  },
  showModal({ commit }) {
    commit("SHOW_MODAL");
  },
  hideModal({ commit }) {
    commit("HIDE_MODAL");
  }
};
