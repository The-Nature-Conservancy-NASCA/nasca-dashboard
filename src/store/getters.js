export default {
  filtro(state) {
    return state.filtro;
  },
  biodiversidad: state => group => {
    const features = state.biodiversidad.filter(
      item => item.grupo_tnc === group
    );
    const covers = [...new Set(features.map(item => item.cobertura))];
    const data = [];
    covers.forEach(cover => {
      const count = [
        ...new Set(
          features
            .filter(item => item.cobertura === cover)
            .map(item => item.especie)
        )
      ].length;
      data.push({ name: cover, value: count });
    });
    return data;
  },
  biodiversityGroupCount: state => group => {
    const features = state.biodiversidad.filter(
      item => item.grupo_tnc === group
    );
    return [...new Set(features.map(item => item.especie))].length;
  },
  biodiversityIcon: state => group => {
    const icono = state.iconos.find(item => item.grupo_tnc === group);
    return icono ? icono.url : null;
  },
  gruposBiodiversidad(state) {
    const features = state.biodiversidad;
    return [...new Set(features.map(item => item.grupo_tnc))];
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
  carbono: state => {
    const features = state.carbono;
    const domain = {
      0: "Biomasa",
      1: "Suelos",
      2: "Madera"
    };
    const field = "comportamiento";
    const defaultKey = "Total";
    const startYear = new Date(features[0].fecha).getFullYear();
    const years = Array.from(Array(startYear + 21).keys()).slice(startYear);
    const data = [];
    features.forEach((feat, i) => {
      let key;
      if (!field) {
        key = defaultKey;
      } else {
        if (field === "comportamiento") {
          key = domain[feat[field]];
        } else {
          key = feat[field];
        }
      }
      for (let j = 0; j <= 20; j++) {
        const t = `T${j}`;
        const year = years[j];
        if (i == 0) {
          const obj = { year: year };
          obj[key] = feat[t];
          data.push(obj);
        } else {
          const obj = data.filter(el => el.year == year)[0];
          if (key in obj) {
            obj[key] += feat[t];
          } else {
            obj[key] = feat[t];
          }
        }
      }
    });
    return {
      data: data,
      years: years
    };
  },
  coberturasPorProyectos: (state, getters) => idsProyecto => {
    if (idsProyecto) {
      const prediosPorProyecto = getters
        .predios(idsProyecto)
        .map(predio => predio.ID_predio);

      return state.coberturas.filter(cobertura =>
        prediosPorProyecto.includes(cobertura.ID_predio)
      );
    }
  },
  coberturasPorEstrategia: (state, getters) => idEstrategia => {
    if (idEstrategia) {
      const proyectos = getters.proyectosPorEstrategia(idEstrategia);
      return getters.coberturasPorProyectos(proyectos);
    }
  },
  coberturas: (state, getters) => {
    const features =
      state.filtro.modo === "estrategia"
        ? getters.coberturasPorEstrategia(state.filtro.valor)
        : state.filtro.modo === "proyecto"
        ? getters.coberturasPorProyectos([state.filtro.valor])
        : state.coberturas;
    const year = state.filtro.year;

    const years = [
      ...new Set(
        features
          .filter(item => item.fecha_visita !== null)
          .map(item => new Date(item.fecha_visita).getFullYear())
      )
    ];
    const data = { name: "coberturas", children: [], years: years };
    features
      .filter(feature => new Date(feature.fecha_visita).getFullYear() == year)
      .forEach(feat => {
        // features.forEach(feat => {
        const parentExists = !!data.children.filter(
          child => child.name === feat["cobertura_proyecto"]
        ).length;
        if (parentExists) {
          const parent = data.children.filter(
            child => child.name === feat["cobertura_proyecto"]
          )[0];
          const childrenExists = !!parent.children.filter(
            child => child.name === feat["subcobertura_proyecto"]
          ).length;
          if (childrenExists) {
            const childEl = parent.children.filter(
              child => child.name === feat["subcobertura_proyecto"]
            )[0];
            childEl.value += feat["area"];
          } else {
            const obj = {
              name: feat["subcobertura_proyecto"],
              id: feat["ID_cobertura"],
              value: feat["area"],
              color: getters.colorPorCobertura(feat["ID_cobertura"])
            };
            parent.children.push(obj);
          }
        } else {
          const obj = {
            name: feat["cobertura_proyecto"],
            children: [
              {
                name: feat["subcobertura_proyecto"],
                id: feat["ID_cobertura"],
                value: feat["area"],
                color: getters.colorPorCobertura(feat["ID_cobertura"])
              }
            ]
          };
          data.children.push(obj);
        }
      });
    return data;
  },
  implementacionesPorProyectos: (state, getters) => idsProyecto => {
    if (idsProyecto) {
      const prediosPorProyecto = getters
        .predios(idsProyecto)
        .map(predio => predio.ID_predio);

      return state.implementaciones.filter(impl =>
        prediosPorProyecto.includes(impl.ID_predio)
      );
    }
  },
  implementacionesPorEstrategia: (state, getters) => idEstrategia => {
    if (idEstrategia) {
      const proyectos = getters.proyectosPorEstrategia(idEstrategia);
      return getters.implementacionesPorProyectos(proyectos);
    }
  },
  implementaciones: (state, getters) => {
    const features =
      state.filtro.modo === "estrategia"
        ? getters.implementacionesPorEstrategia(state.filtro.valor)
        : state.filtro.modo === "proyecto"
        ? getters.implementacionesPorProyectos([state.filtro.valor])
        : state.implementaciones;
    // const year = state.filtro.year;

    // const years = [
    //   ...new Set(
    //     features
    //       .filter(item => item.fecha_visita !== null)
    //       .map(item => new Date(item.fecha_visita).getFullYear())
    //   )
    // ];

    const actions = {
      "Manejo sostenible": "area_manejo_sostenible",
      Bosque: "area_bosque",
      Restauración: "area_restauracion",
      "Producción sostenible": "areas_p_sostenibles"
    };

    const data = [];
    features.forEach(feat => {
      for (let action in actions) {
        if (!actions.hasOwnProperty(action)) {
          continue;
        }
        let obj;
        const area = feat[actions[action]];
        obj = data.find(item => item.name === action);
        if (obj) {
          obj.value += area;
        } else {
          obj = {
            name: action,
            value: area
          };
          data.push(obj);
        }
      }
    });

    return data;
  }
};
