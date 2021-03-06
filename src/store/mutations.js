export default {
  SET_ALIADOS(state, payload) {
    state.aliados = payload;
  },
  SET_PARTICIPANTES(state, payload) {
    state.participantes = payload;
  },
  SET_CONTRIBUCIONES(state, payload) {
    state.contribuciones = payload;
  },
  SET_BIODIVERSIDAD(state, payload) {
    state.biodiversidad = payload;
  },
  SET_CARBONO(state, payload) {
    state.carbono = payload;
  },
  SET_COBERTURAS(state, payload) {
    state.coberturas = payload;
  },
  CHANGE_BOX_SUBTITLE(state, payload) {
    state.boxes.find(box => box.title === payload.title).subtitle =
      payload.subtitle;
  },
  PONER_FILTRO_PROYECTO(state, payload) {
    state.filtro.modo = "proyecto";
    state.filtro.valor = payload;
    for (let key in state.filtro.year) {
      if (state.filtro.year.hasOwnProperty(key)) {
        state.filtro.year[key] = null;
      }
    }
  },
  PONER_FILTRO_ESTRATEGIA(state, payload) {
    state.filtro.modo = "estrategia";
    state.filtro.valor = payload;
    for (let key in state.filtro.year) {
      if (state.filtro.year.hasOwnProperty(key)) {
        state.filtro.year[key] = null;
      }
    }
  },
  RESET_FILTRO(state) {
    state.filtro.modo = "colombia";
    state.filtro.value = null;
    for (let key in state.filtro.year) {
      if (state.filtro.year.hasOwnProperty(key)) {
        state.filtro.year[key] = null;
      }
    }
  },
  CHANGE_CARBONO_FIELD(state, payload) {
    state.filtro.carbonoField = payload;
  },
  CHANGE_CLASSIFICATION_SCHEME(state, payload) {
    state.filtro.classificationScheme = payload;
  },
  CHANGE_ALLY_TYPE(state, payload) {
    state.filtro.allyType = payload;
  },
  CHANGE_CONTRIBUTION_TYPE(state, payload) {
    state.filtro.contributionType = payload;
  },
  CHANGE_MOMENT(state, payload) {
    state.filtro.moment = payload;
  },
  CHANGE_YEAR(state, payload) {
    state.filtro.year[payload.component] = payload.year;
  },
  CHANGE_LANGUAGE(state, payload) {
    state.filtro.language = payload;
  },
  SET_IMPLEMENTACIONES(state, payload) {
    state.implementaciones = payload;
  },
  SET_ESTRATEGIAS(state, payload) {
    state.estrategias = payload;
  },
  SET_REGIONES(state, payload) {
    state.regiones = payload;
  },
  SET_PROYECTOS(state, payload) {
    state.proyectos = payload;
  },
  SET_PREDIOS(state, payload) {
    state.predios = payload;
  },
  SET_COLORES(state, payload) {
    state.colores = payload;
  },
  SET_ICONOS(state, payload) {
    state.iconos = payload;
  },
  SET_METAS(state, payload) {
    state.metas = payload;
  },
  SHOW_MODAL(state) {
    state.modalVisible = true;
  },
  HIDE_MODAL(state) {
    state.modalVisible = false;
  },
  SET_MODAL_CONTENT(state, payload) {
    state.modalContent.header = payload.header;
    state.modalContent.content = payload.content;
  },
  SET_TEXTOS_GENERALES(state, payload) {
    state.textos = payload;
  }
};
