export default {
  cambiarProyecto({ commit }, nuevoProyecto) {
    commit("PONER_FILTRO_PROYECTO", nuevoProyecto);
  },
  verTodo({ commit }) {
    commit("RESET_FILTRO");
  }
}