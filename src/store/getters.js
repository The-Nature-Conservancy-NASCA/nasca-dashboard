export default {
  filtro(state) {
    return state.filtro;
  },
  colorPorCobertura: state => idCobertura => {
    return state.colores.find(color => color.ID_cobertura === idCobertura)
      .color;
  },
  estrategias(state) {
    return state.estrategias.map(estrategia => {
      return {
        id: estrategia.ID_estrategia,
        nombre: estrategia.nombre
      };
    });
  },
  proyectos(state) {
    return state.proyectos.map(proyecto => {
      return {
        id: proyecto.ID_proyecto,
        nombre: proyecto.nombre
      };
    });
  },
  proyectosPorEstrategia: state => estrategia => {
    return state.proyectos
      .filter(proyecto => proyecto.ID_estrategia === estrategia)
      .map(proyecto => proyecto.ID_proyecto);
  },
  predios: state => idsProyecto => {
    return idsProyecto
      ? state.predios.filter(predio => idsProyecto.includes(predio.ID_proyecto))
      : state.predios;
  },
  coberturasPorProyectos: (state, getters) => idsProyecto => {
    if (idsProyecto) {
      const prediosPorProyecto = getters.predios(idsProyecto).map(predio => predio.ID_predio);

      return state.coberturas.filter(cobertura => prediosPorProyecto.includes(cobertura.ID_predio));
    }
  },
  coberturasPorEstrategia: (state, getters) => idEstrategia => {
    if (idEstrategia) {
      const proyectos = getters.proyectosPorEstrategia(idEstrategia);
      return getters.coberturasPorProyectos(proyectos);
    }
  },
  coberturas: (state, getters) => {
    const features = state.filtro.modo === "estrategia" ?
      getters.coberturasPorEstrategia(state.filtro.valor) :
      state.filtro.modo === "proyecto" ?
        getters.coberturasPorProyectos([state.filtro.valor]) :
        state.coberturas;

    const data = {"name": "coberturas", "children": []};
    features.filter(feature => new Date(feature.fecha_visita).getFullYear() == 2010).forEach(feat => {
      const parentExists = !!data.children.filter(child => child.name === feat["cobertura_proyecto"]).length;
      if (parentExists) {
        const parent = data.children.filter(child => child.name === feat["cobertura_proyecto"])[0]
        const childrenExists = !!parent.children.filter(child => child.name === feat["subcobertura_proyecto"]).length;
        if (childrenExists) {
          const childEl = parent.children.filter(child => child.name === feat["subcobertura_proyecto"])[0];
          childEl.value += feat["area"];
        } else {
          const obj = {
            "name": feat["subcobertura_proyecto"],
            "id": feat["ID_cobertura"],
            "value": feat["area"]
          };
          parent.children.push(obj);
        }
      } else {
        const obj = {
          "name": feat["cobertura_proyecto"],
          "children": [{
            "name": feat["subcobertura_proyecto"],
            "id": feat["ID_cobertura"],
            "value": feat["area"]
          }]
        };
        data.children.push(obj);
      }
    })

    return data;
  }
};
