export default {
  SET_BIODIVERSIDAD(state, payload) {
    state.biodiversidad = payload;
  },
  SET_COLORES(state, payload) {
    state.colores = payload;
  },
  SET_ICONOS(state, payload) {
    state.iconos = payload;
  },
  SET_CARBONO(state, payload) {
    state.carbono = payload;
  },
  SET_METAS(state, payload) {
    state.metas = payload;
  },
  SET_COBERTURAS(state, payload) {
    state.coberturas = payload;
  },
  SET_IMPLEMENTACIONES(state, payload) {
    state.implementaciones = payload;
  },
  SET_ALIADOS(state, payload) {
    state.aliados = payload;
  },
  SET_PARTICIPANTES(state, payload) {
    state.participantes = payload;
  },
  SET_CONTRIBUCIONES(state, payload) {
    state.contribuciones = payload;
  },
  SET_ESTRATEGIAS(state, payload) {
    state.estrategias = payload;
  },
  SET_PROYECTOS(state, payload) {
    state.proyectos = payload;
  },
  SET_PREDIOS(state, payload) {
    state.predios = payload;
  },
  PONER_FILTRO_PROYECTO(state, payload) {
    state.filtro.modo ="proyecto";
    state.filtro.valor = payload;
  },
  RESET_FILTRO(state) {
    state.filtro.modo = "colombia";
    state.filtro.value = null;
  },
  CHANGE_YEAR(state, payload) {
    state.filtro.year = payload;
  }
};
