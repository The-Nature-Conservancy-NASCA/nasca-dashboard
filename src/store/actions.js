export default {
  cambiarProyecto({ commit }, nuevoProyecto) {
    commit("PONER_FILTRO_PROYECTO", nuevoProyecto);
  },
  verTodo({ commit }) {
    commit("RESET_FILTRO");
  },
  changeYear({ commit }, newYear) {
    commit("CHANGE_YEAR", newYear);
  }
}