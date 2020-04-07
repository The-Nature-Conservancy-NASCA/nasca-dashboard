import marked from "marked";

export default {
  participantesExport: (state, getters) => {
    const data = getters.participantes.map(item => {
      return { genero: item.name, total: item.value };
    });
    const header = Object.keys(data[0]);
    return { data: data, header: header };
  },
  contribucionesPorProyectos: state => idsProyecto => {
    if (idsProyecto) {
      return state.contribuciones.filter(item =>
        idsProyecto.includes(item.ID_proyecto)
      );
    }
  },
  contribucionesPorEstrategia: (state, getters) => idEstrategia => {
    if (idEstrategia) {
      const proyectos = getters.proyectosPorEstrategia(idEstrategia);
      return getters.contribucionesPorProyectos(
        proyectos.map(proyecto => proyecto.id)
      );
    }
  },
  contribuciones: (state, getters) => {
    const features =
      state.filtro.modo === "estrategia"
        ? getters.contribucionesPorEstrategia(state.filtro.valor)
        : state.filtro.modo === "proyecto"
        ? getters.contribucionesPorProyectos([state.filtro.valor])
        : state.contribuciones;

    return features;
  },
  aliadosPorProyectos: state => idsProyecto => {
    if (idsProyecto) {
      return state.aliados.filter(item =>
        idsProyecto.includes(item.ID_proyecto)
      );
    }
  },
  aliadosPorEstrategia: (state, getters) => idEstrategia => {
    if (idEstrategia) {
      const proyectos = getters.proyectosPorEstrategia(idEstrategia);
      return getters.aliadosPorProyectos(
        proyectos.map(proyecto => proyecto.id)
      );
    }
  },
  aliados: (state, getters) => {
    const features =
      state.filtro.modo === "estrategia"
        ? getters.aliadosPorEstrategia(state.filtro.valor)
        : state.filtro.modo === "proyecto"
        ? getters.aliadosPorProyectos([state.filtro.valor])
        : state.aliados;

    return features;
  },
  biodiversidadPorProyectos: (state, getters) => idsProyectos => {
    const biodiversidad = [];
    idsProyectos.forEach(idProyecto => {
      let moment;
      if (state.filtro.moment === "99") {
        moment = getters.mostRecentMoment(idProyecto);
      } else {
        moment = state.filtro.moment;
      }
      const biodiversidadProyecto = state.biodiversidad.filter(item => {
        return item.ID_proyecto === idProyecto && +item.momento <= +moment;
      });
      biodiversidad.push(...biodiversidadProyecto);
    });

    return biodiversidad;
  },
  biodiversidadPorEstrategia: (state, getters) => idEstrategia => {
    if (idEstrategia) {
      const proyectos = getters.proyectosPorEstrategia(idEstrategia);
      return getters.biodiversidadPorProyectos(
        proyectos.map(proyecto => proyecto.id)
      );
    }
  },
  biodiversidad: (state, getters) => {
    const features =
      state.filtro.modo === "estrategia"
        ? getters.biodiversidadPorEstrategia(state.filtro.valor)
        : state.filtro.modo === "proyecto"
        ? getters.biodiversidadPorProyectos([state.filtro.valor])
        : getters.biodiversidadPorProyectos(getters.proyectosId);

    let landcoverField;
    if (state.filtro.modo === "proyecto") {
      landcoverField = "cobertura";
    } else {
      landcoverField = "cobertura_comun";
    }

    const data = [];
    features.forEach(item => {
      let group = data.find(group => group.name === item.grupo_tnc);
      if (!group) {
        group = {
          name: item.grupo_tnc,
          data: [],
          unique_species: [item.especie]
        };
        group.data.push({
          name: item[landcoverField],
          unique_species: [item.especie]
        });
        data.push(group);
      } else {
        let landcover = group.data.find(
          landcover => landcover.name === item[landcoverField]
        );
        if (!group.unique_species.includes(item.especie)) {
          group.unique_species.push(item.especie);
        }
        if (!landcover) {
          landcover = {
            name: item[landcoverField],
            unique_species: [item.especie]
          };
          group.data.push(landcover);
        } else {
          if (!landcover.unique_species.includes(item.especie)) {
            landcover.unique_species.push(item.especie);
          }
        }
      }
    });
    data.forEach(group => {
      group.value = group.unique_species.length;
      delete group.unique_species;
      group.data.forEach(landcover => {
        landcover.value = landcover.unique_species.length;
        delete landcover.unique_species;
      });
    });
    return data;
  },
  biodiversityIcon: state => group => {
    const icono = state.iconos.find(item => item.grupo_tnc === group);
    return icono ? icono.url : null;
  },
  coloresBiodiversidad: (state, getters) => groupName => {
    const group = getters.biodiversidad.find(group => group.name === groupName);
    const colors = {};
    group.data.forEach(landcover => {
      colors[landcover.name] = getters.colorPorCobertura(landcover.name);
    });
    return colors;
  },
  colorPorCobertura: state => cobertura => {
    const item = state.colores.find(color => color.cobertura === cobertura);
    if (item) {
      return item.color;
    } else {
      return "#000000";
    }
  },
  estrategias(state) {
    return state.estrategias.map(estrategia => {
      return {
        id: estrategia.ID_estrategia,
        nombre: estrategia.nombre,
        color: estrategia.color
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
  proyectosId(state) {
    return state.proyectos.map(proyecto => proyecto.ID_proyecto);
  },
  baselineYear: state => projectId => {
    const baselineDate = state.proyectos.find(
      project => project.ID_proyecto === projectId
    ).fecha_linea_base;
    return new Date(baselineDate).getFullYear();
  },
  carbonoPorProyecto: (state, getters) => {
    const factor = 1000000; // pasar de toneladas a Megatoneladas (1 t = 1e-6 Mt)
    const idProyecto = state.filtro.valor;
    if (idProyecto) {
      const regionesPorProyecto = getters
        .regionesProyecto(idProyecto)
        .map(region => region.ID_region);
      const features = state.carbono.filter(item =>
        regionesPorProyecto.includes(item.ID_region)
      );
      const domain = {
        0: "Biomasa",
        1: "Suelos",
        2: "Madera"
      };
      const field = state.filtro.carbonoField;
      const defaultKey = "Total";
      let years;
      if (features.length) {
        const baselineYear = getters.baselineYear(idProyecto);
        years = Array.from(Array(baselineYear + 21).keys()).slice(baselineYear);
      } else {
        years = [];
      }
      const data = [];
      features.forEach((feat, i) => {
        let key;
        if (!field) {
          key = defaultKey;
        } else {
          if (field === "compartimiento") {
            key = domain[feat[field]];
          } else if (field === "total") {
            key = defaultKey;
          } else {
            key = feat[field];
          }
        }
        for (let j = 0; j <= 20; j++) {
          const t = `T${j}`;
          const year = years[j];
          if (i == 0) {
            const obj = { year: year };
            obj[key] = feat[t] / factor;
            data.push(obj);
          } else {
            const obj = data.filter(el => el.year == year)[0];
            if (key in obj) {
              obj[key] += feat[t] / factor;
            } else {
              obj[key] = feat[t] / factor;
            }
          }
        }
      });
      return {
        data: data,
        years: years
      };
    }
  },
  carbonoPorProyectos: (state, getters) => idsProyecto => {
    if (idsProyecto) {
      const regionesPorProyecto = getters
        .regionesEstrategia(idsProyecto)
        .map(region => region.ID_region);
      return state.carbono.filter(item =>
        regionesPorProyecto.includes(item.ID_region)
      );
    }
  },
  carbonoPorEstrategia: (state, getters) => idEstrategia => {
    if (idEstrategia) {
      const proyectos = getters.proyectosPorEstrategia(idEstrategia);
      return getters.carbonoPorProyectos(
        proyectos.map(proyecto => proyecto.id)
      );
    }
  },
  carbono: (state, getters) => {
    const factor = 1000000; // pasar de toneladas a Megatoneladas (1 t = 1e-6 Mt)
    let features;
    if (state.filtro.modo === "estrategia") {
      features = getters.carbonoPorEstrategia(state.filtro.valor);
    } else if (state.filtro.modo === "colombia") {
      features = state.carbono;
    }
    const domain = {
      0: "Biomasa",
      1: "Suelos",
      2: "Madera"
    };
    const field = state.filtro.carbonoField;
    const defaultKey = "Total";
    const data = [];
    features.forEach(feat => {
      let key;
      if (!field) {
        key = defaultKey;
      } else {
        if (field === "compartimiento") {
          key = domain[feat[field]];
        } else if (field === "total") {
          key = defaultKey;
        } else {
          key = feat[field];
        }
      }
      if (key) {
        const yearField = getters.carbonoYearField(feat.ID_region);
        const obj = data.find(item => item.name == key);
        if (obj) {
          obj.value += feat[yearField] / factor;
        } else {
          data.push({ name: key, value: feat[yearField] / factor });
        }
      }
    });
    return data;
  },
  carbonoYearField: (state, getters) => regionId => {
    const projectId = state.regiones.find(
      region => region.ID_region === regionId
    ).ID_proyecto;
    let moment;
    if (state.filtro.moment === "99") {
      moment = getters.mostRecentMoment(projectId);
    } else {
      moment = state.filtro.moment;
    }
    const project = state.proyectos.find(
      project => project.ID_proyecto === projectId
    );
    const baselineYear = new Date(project.fecha_linea_base).getFullYear();
    const selectedMoment = state.availableMoments.find(
      item => item.value == moment
    );
    const selectedMomentYear = new Date(
      project[selectedMoment.field]
    ).getFullYear();
    const delta = selectedMomentYear - baselineYear;
    return "T" + delta;
  },
  carbonoExport: (state, getters) => {
    const data = [];
    let header;
    if (getters.filtro.modo === "proyecto") {
      getters.carbonoPorProyecto.data.forEach(item => {
        const obj = {};
        delete Object.assign(obj, item, { ["año"]: item["year"] })["year"];
        data.push(obj);
      });
      header = Object.keys(data[0]);
    } else {
      const obj = {};
      getters.carbono.forEach(item => {
        obj[item.name] = item.value;
      });
      data.push(obj);
      header = Object.keys(obj);
    }
    return { data: data, header: header };
  },
  coberturasPorProyectos: (state, getters) => idsProyectos => {
    const coberturas = [];
    idsProyectos.forEach(idProyecto => {
      let moment;
      if (state.filtro.moment === "99") {
        moment = getters.mostRecentMoment(idProyecto);
      } else {
        moment = state.filtro.moment;
      }
      const predios = getters
        .predios(idProyecto)
        .map(predio => predio.ID_predio);
      const coberturasProyecto = state.coberturas.filter(cobertura => {
        return (
          predios.includes(cobertura.ID_predio) && cobertura.momento === moment
        );
      });
      coberturas.push(...coberturasProyecto);
    });

    return coberturas;
  },
  coberturasPorEstrategia: (state, getters) => idEstrategia => {
    if (idEstrategia) {
      const proyectos = getters.proyectosPorEstrategia(idEstrategia);
      return getters.coberturasPorProyectos(
        proyectos.map(proyecto => proyecto.id)
      );
    }
  },
  coberturas: (state, getters) => {
    const features =
      state.filtro.modo === "estrategia"
        ? getters.coberturasPorEstrategia(state.filtro.valor)
        : state.filtro.modo === "proyecto"
        ? getters.coberturasPorProyectos([state.filtro.valor])
        : getters.coberturasPorProyectos(getters.proyectosId);

    const constants = {
      NAME: "coberturas",
      PARENT_LABEL:
        state.filtro.classificationScheme === "project"
          ? "cobertura_proyecto"
          : "cobertura_comun",
      CHILD_LABEL:
        state.filtro.classificationScheme === "project"
          ? "subcobertura_proyecto"
          : "corine2",
      VALUE_FIELD: "area",
      ID_FIELD: "ID_cobertura"
    };

    const data = { name: constants.NAME, children: [] };
    features.forEach(feat => {
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
            color: getters.colorPorCobertura(feat[constants.PARENT_LABEL])
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
              color: getters.colorPorCobertura(feat[constants.PARENT_LABEL])
            }
          ]
        };
        data.children.push(obj);
      }
    });
    return data;
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
  boxConfiguration(state, getters) {
    return state.boxes.map(box => {
      const title = getters.strings[box.titleStr];
      box.title = title;
      return box;
    });
  },
  strings(state, getters) {
    const idioma = getters.idiomaActual;
    return state.strings[idioma];
  },
  filtro(state) {
    return state.filtro;
  },
  idiomaActual(state) {
    return state.filtro.language;
  },
  implementacionesPorProyectos: (state, getters) => (
    idsProyectos,
    filterByMoment = true
  ) => {
    const implementaciones = [];
    idsProyectos.forEach(idProyecto => {
      let moment;
      if (state.filtro.moment === "99") {
        moment = getters.mostRecentMoment(idProyecto);
      } else {
        moment = state.filtro.moment;
      }
      const predios = getters
        .predios(idProyecto)
        .map(predio => predio.ID_predio);
      const implementacionesProyecto = state.implementaciones.filter(
        implementacion => {
          if (filterByMoment) {
            return (
              predios.includes(implementacion.ID_predio) &&
              implementacion.momento === moment
            );
          } else {
            return predios.includes(implementacion.ID_predio);
          }
        }
      );
      implementaciones.push(...implementacionesProyecto);
    });

    return implementaciones;
  },
  implementacionesPorEstrategia: (state, getters) => (
    idEstrategia,
    filterByMoment = true
  ) => {
    if (idEstrategia) {
      const proyectos = getters.proyectosPorEstrategia(idEstrategia);
      return getters.implementacionesPorProyectos(
        proyectos.map(proyecto => proyecto.id),
        filterByMoment
      );
    }
  },
  implementaciones: (state, getters) => {
    const features =
      state.filtro.modo === "estrategia"
        ? getters.implementacionesPorEstrategia(state.filtro.valor)
        : state.filtro.modo === "proyecto"
        ? getters.implementacionesPorProyectos([state.filtro.valor])
        : getters.implementacionesPorProyectos(getters.proyectosId);

    const actions = {
      [getters.strings.implementacionesBosque]: "area_bosque",
      [getters.strings.implementacionesRestauracion]: "area_restauracion",
      [getters.strings.implementacionesProduccionSostenible]:
        "areas_p_sostenibles"
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
    return data.sort((a, b) => a.name.localeCompare(b.name)); // asegurarse de devolver un array ordenado por el nombre de la accion
  },
  domainUpperBoundImplementaciones: (state, getters) => {
    const moments = ["0", "1", "2", "3"];
    const fields = ["area_bosque", "areas_p_sostenibles", "area_restauracion"];
    const features =
      state.filtro.modo === "estrategia"
        ? getters.implementacionesPorEstrategia(state.filtro.valor, false)
        : state.filtro.modo === "proyecto"
        ? getters.implementacionesPorProyectos([state.filtro.valor], false)
        : getters.implementacionesPorProyectos(getters.proyectosId, false);
    const values = [];
    moments.forEach(moment => {
      fields.forEach(field => {
        values.push(
          features
            .filter(feat => feat.momento === moment)
            .reduce((a, b) => a + b[field], 0)
        );
      });
    });
    return Math.max(...values);
  },
  participantesPorProyectos: (state, getters) => idsProyectos => {
    const participantes = [];
    idsProyectos.forEach(idProyecto => {
      let moment;
      if (state.filtro.moment === "99") {
        moment = getters.mostRecentMoment(idProyecto);
      } else {
        moment = state.filtro.moment;
      }
      const participantesProyecto = state.participantes.filter(item => {
        return item.ID_proyecto === idProyecto && item.momento === moment;
      });
      participantes.push(...participantesProyecto);
    });

    return participantes;
  },
  participantesPorEstrategia: (state, getters) => idEstrategia => {
    if (idEstrategia) {
      const proyectos = getters.proyectosPorEstrategia(idEstrategia);
      return getters.participantesPorProyectos(
        proyectos.map(proyecto => proyecto.id)
      );
    }
  },
  participantes: (state, getters) => {
    const features =
      state.filtro.modo === "estrategia"
        ? getters.participantesPorEstrategia(state.filtro.valor)
        : state.filtro.modo === "proyecto"
        ? getters.participantesPorProyectos([state.filtro.valor])
        : getters.participantesPorProyectos(getters.proyectosId);
    const genders = {
      [getters.strings.hombres]: "numero_hombres",
      [getters.strings.mujeres]: "numero_mujeres",
      [getters.strings.sinInformacion]: "numero_sin_informacion"
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
        : getters.participantesPorProyectos(getters.proyectosId);

    const groups = {
      [getters.strings.indigenas]: "numero_indigenas",
      [getters.strings.campesinos]: "numero_campesinos"
    };
    const counts = {};
    features.forEach(feat => {
      for (let group in groups) {
        if (!groups.hasOwnProperty(group)) {
          continue;
        }
        const count = feat[groups[group]];
        if (count !== null) {
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
  biodiversidadExport: () => group => {
    const data = group.data.map(item => {
      return { cobertura: item.name, especies: item.value };
    });
    const header = ["cobertura", "especies"];
    return { data: data, header: header };
  },
  implementacionesExport: (state, getters) => {
    const data = getters.implementaciones.map(item => {
      return { accion: item.name, area: item.value };
    });
    const header = Object.keys(data[0]);
    return { data: data, header: header };
  },
  selectedProjectClosingYear(state) {
    if (state.filtro.modo === "proyecto") {
      const ts = state.proyectos.find(
        project => project.ID_proyecto === state.filtro.valor
      ).fecha_cierre;
      return new Date(ts).getFullYear();
    }
  },
  proyectosPorEstrategia: state => estrategia => {
    return state.proyectos
      .filter(proyecto => proyecto.ID_estrategia === estrategia)
      .map(proyecto => {
        return {
          id: proyecto.ID_proyecto,
          nombre: proyecto.nombre,
          estrategia,
          color: proyecto.color
        };
      });
  },
  predios: state => idsProyecto => {
    return idsProyecto
      ? state.predios.filter(predio => idsProyecto.includes(predio.ID_proyecto))
      : state.predios;
  },
  regionesProyecto: state => idProyecto => {
    return idProyecto
      ? state.regiones.filter(region => idProyecto == region.ID_proyecto)
      : state.regiones;
  },
  regionesEstrategia: state => idsProyecto => {
    return idsProyecto
      ? state.regiones.filter(region =>
          idsProyecto.includes(region.ID_proyecto)
        )
      : state.regiones;
  },
  metasPorProyectos: (state, getters) => idsProyectos => {
    const metas = [];
    idsProyectos.forEach(idProyecto => {
      let moment;
      if (state.filtro.moment === "99") {
        moment = getters.mostRecentMoment(idProyecto);
      } else {
        moment = state.filtro.moment;
      }
      // obtener metas por proyecto y agregar a metas globales
      const projectGoals = state.metas.filter(
        item => item.ID_proyecto === idProyecto
      );
      const uniqueProjectGoals = [
        ...new Set(projectGoals.map(item => item.meta))
      ];
      uniqueProjectGoals.forEach(goalName => {
        const projectGoal = projectGoals.find(item => item.meta === goalName);
        let goal = metas.find(item => item.name === goalName);
        if (goal) {
          goal.value += projectGoal.valor; // sumar valor de la misma meta en diferentes
        } else {
          goal = {
            name: projectGoal.meta,
            unit: projectGoal.unidad,
            value: projectGoal.valor,
            progress: 0
          };
          metas.push(goal);
        }
      });
      state.metas
        .filter(item => {
          return item.ID_proyecto === idProyecto && item.momento === moment;
        })
        .forEach(projectGoal => {
          const goal = metas.find(item => item.name === projectGoal.meta);
          goal.progress += projectGoal.progreso;
        });
    });
    return metas;
  },
  metasPorEstrategia: (state, getters) => idEstrategia => {
    if (idEstrategia) {
      const proyectos = getters.proyectosPorEstrategia(idEstrategia);
      return getters.metasPorProyectos(proyectos.map(proyecto => proyecto.id));
    }
  },
  metas: (state, getters) => {
    const goals =
      state.filtro.modo === "estrategia"
        ? getters.metasPorEstrategia(state.filtro.valor)
        : state.filtro.modo === "proyecto"
        ? getters.metasPorProyectos([state.filtro.valor])
        : getters.metasPorProyectos(getters.proyectosId);

    return goals;
  },
  momentos: state => projectId => {
    const project = state.proyectos.find(
      project => project.ID_proyecto === projectId
    );
    const moments = [];
    state.availableMoments.forEach(moment => {
      if (project[moment.field]) {
        moments.push(moment);
      }
    });
    return moments;
  },
  mostRecentMoment: (state, getters) => projectId => {
    const moment = Math.max(
      ...getters.momentos(projectId).map(moment => moment.value)
    );
    return moment.toString();
  },
  currentLevel: state => {
    const modo = state.filtro.modo;
    const valor = state.filtro.valor;
    let level;
    if (modo === "proyecto") {
      const project = state.proyectos.find(
        proyecto => proyecto.ID_proyecto === valor
      );
      const strategyName = state.estrategias.find(
        estrategia => estrategia.ID_estrategia === project.ID_estrategia
      ).nombre;
      level = `${strategyName}: ${project.nombre}`;
    } else if (modo === "estrategia") {
      level = state.estrategias.find(
        estrategia => estrategia.ID_estrategia === valor
      ).nombre;
    } else {
      level = "Colombia";
    }
    return level;
  },
  panelDescription: state => panelName => {
    const fieldMap = {
      aliados: "descripcion_aliados",
      biodiversidad: "descripcion_biodiversidad",
      carbono: "descripcion_carbono",
      coberturas: "descripcion_coberturas",
      contribuciones: "descripcion_contribuciones",
      implementaciones: "descripcion_implementaciones",
      metas: "descripcion_metas",
      participantes: "descripcion_participantes"
    };
    const textField =
      state.filtro.language === "es" ? "texto_espanol" : "texto_ingles";
    let text;
    if (state.filtro.modo === "proyecto") {
      text = state.proyectos.find(
        item => item.ID_proyecto === state.filtro.valor
      )[fieldMap[panelName]];
    } else {
      text = state.textos.find(item => item.identificador === panelName)[
        textField
      ];
    }
    return marked(text);
  }
};
