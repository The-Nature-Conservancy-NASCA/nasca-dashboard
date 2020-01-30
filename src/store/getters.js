export default {
  filtro(state) {
    return state.filtro;
  },
  biodiversidad: state => group => {
    const year = state.filtro.year.biodiversidad;
    const features = state.biodiversidad.filter(item => {
      return (
        item.grupo_tnc === group &&
        new Date(item.fecha_identificacion).getFullYear() <= year &&
        item.fecha_identificacion !== null
      );
    });
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
    const year = state.filtro.year.biodiversidad;
    const features = state.biodiversidad.filter(item => {
      return (
        item.grupo_tnc === group &&
        new Date(item.fecha_identificacion).getFullYear() <= year &&
        item.fecha_identificacion !== null
      );
    });
    return [...new Set(features.map(item => item.especie))].length;
  },
  biodiversityIcon: state => group => {
    const icono = state.iconos.find(item => item.grupo_tnc === group);
    return icono ? icono.url : null;
  },
  gruposBiodiversidad(state) {
    const year = state.filtro.year.biodiversidad;
    const features = state.biodiversidad.filter(item => {
      return (
        new Date(item.fecha_identificacion).getFullYear() <= year &&
        item.fecha_identificacion !== null
      );
    });
    return [...new Set(features.map(item => item.grupo_tnc))];
  },
  yearsBiodiversidad(state) {
    const features = state.biodiversidad;
    const years = [
      ...new Set(
        features
          .filter(item => item.fecha_identificacion !== null)
          .map(item => new Date(item.fecha_identificacion).getFullYear())
      )
    ].sort();
    if (!state.filtro.year.biodiversidad) {
      state.filtro.year.biodiversidad = years.slice(-1)[0];
    }
    return years;
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

    const constants = {
      NAME: "coberturas",
      PARENT_LABEL:
        state.filtro.classificationScheme === "project"
          ? "cobertura_proyecto"
          : "corine1",
      CHILD_LABEL:
        state.filtro.classificationScheme === "project"
          ? "subcobertura_proyecto"
          : "corine2",
      VALUE_FIELD: "area",
      ID_FIELD: "ID_cobertura"
    };

    const years = [
      ...new Set(
        features
          .filter(item => item.fecha_visita !== null)
          .map(item => new Date(item.fecha_visita).getFullYear())
      )
    ];
    let year;
    if (state.filtro.year.coberturas) {
      year = state.filtro.year.coberturas;
    } else {
      year = years.slice(-1)[0];
      state.filtro.year.coberturas = year;
    }

    const data = { name: constants.NAME, children: [], years: years };
    features
      .filter(feature => new Date(feature.fecha_visita).getFullYear() == year)
      .forEach(feat => {
        // features.forEach(feat => {
        const parentExists = !!data.children.filter(
          child => child.name === feat[constants.PARENT_LABEL]
        ).length;
        if (parentExists) {
          const parent = data.children.filter(
            child => child.name === feat[constants.PARENT_LABEL]
          )[0];
          const childrenExists = !!parent.children.filter(
            child => child.name === feat[constants.CHILD_LABEL]
          ).length;
          if (childrenExists) {
            const childEl = parent.children.filter(
              child => child.name === feat[constants.CHILD_LABEL]
            )[0];
            childEl.value += feat[constants.VALUE_FIELD];
          } else {
            const obj = {
              name: feat[constants.CHILD_LABEL],
              id: feat[constants.ID_FIELD],
              value: feat[constants.VALUE_FIELD],
              color: getters.colorPorCobertura(feat[constants.ID_FIELD])
            };
            parent.children.push(obj);
          }
        } else {
          const obj = {
            name: feat[constants.PARENT_LABEL],
            children: [
              {
                name: feat[constants.CHILD_LABEL],
                id: feat[constants.ID_FIELD],
                value: feat[constants.VALUE_FIELD],
                color: getters.colorPorCobertura(feat[constants.ID_FIELD])
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

      return state.implementaciones.filter(item =>
        prediosPorProyecto.includes(item.ID_predio)
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
  },
  participantesPorProyectos: state => idsProyecto => {
    if (idsProyecto) {
      return state.participantes.filter(item =>
        idsProyecto.includes(item.ID_proyecto)
      );
    }
  },
  participantesPorEstrategia: (state, getters) => idEstrategia => {
    if (idEstrategia) {
      const proyectos = getters.proyectosPorEstrategia(idEstrategia);
      return getters.participantesPorProyectos(proyectos);
    }
  },
  participantes: (state, getters) => {
    const features =
      state.filtro.modo === "estrategia"
        ? getters.participantesPorEstrategia(state.filtro.valor)
        : state.filtro.modo === "proyecto"
        ? getters.participantesPorProyectos([state.filtro.valor])
        : state.participantes;
    const genders = {
      Hombres: "numero_hombres",
      Mujeres: "numero_mujeres"
    };
    const data = [];
    features.forEach(feat => {
      for (let gender in genders) {
        if (!genders.hasOwnProperty(gender)) {
          continue;
        }
        let obj;
        const count = feat[genders[gender]];
        obj = data.find(item => item.name === gender);
        if (obj) {
          obj.value += count;
        } else {
          obj = {
            name: gender,
            value: count
          };
          data.push(obj);
        }
      }
    });
    return data;
  },
  gruposParticipantes: (state, getters) => {
    const features =
      state.filtro.modo === "estrategia"
        ? getters.participantesPorEstrategia(state.filtro.valor)
        : state.filtro.modo === "proyecto"
        ? getters.participantesPorProyectos([state.filtro.valor])
        : state.participantes;

    const groups = {
      Indígenas: "numero_indigenas",
      Campesinos: "numero_campesinos"
    };
    const counts = {};
    features.forEach(feat => {
      for (let group in groups) {
        if (!groups.hasOwnProperty(group)) {
          continue;
        }
        const count = feat[groups[group]];
        if (count) {
          if (group in counts) {
            counts[group] += count;
          } else {
            counts[group] = count;
          }
        }
      }
    });
    return counts;
  },
  biodiversidadExport: (state, getters) => group => {
    const data = getters.biodiversidad(group).map(item => {
      return { cobertura: item.name, especies: item.value };
    });
    const header = ["cobertura", "especies"];
    return { data: data, header: header };
  },
  carbonoExport: (state, getters) => {
    const data = [];
    getters.carbono.data.forEach(item => {
      const obj = {};
      delete Object.assign(obj, item, { ["año"]: item["year"] })["year"];
      data.push(obj);
    });
    const header = Object.keys(data[0]);
    return { data: data, header: header };
  },
  coberturasExport: (state, getters) => {
    const data = [];
    getters.coberturas.children.forEach(parent => {
      parent.children.forEach(child => {
        const obj = {
          nivel_1: parent.name,
          nivel_2: child.name ? child.name.replace(/, |,/g, "|") : "",
          area: child.value
        };
        data.push(obj);
      });
    });
    const header = ["nivel_1", "nivel_2", "area"];
    return { data, header };
  },
  implementacionesExport: (state, getters) => {
    const data = getters.implementaciones.map(item => {
      return { accion: item.name, area: item.value };
    });
    const header = Object.keys(data[0]);
    return { data: data, header: header };
  },
  participantesExport: (state, getters) => {
    const data = getters.participantes.map(item => {
      return { genero: item.name, total: item.value };
    });
    const header = Object.keys(data[0]);
    return { data: data, header: header };
  }
};
