export default {
  aliados: [],
  participantes: [],
  contribuciones: [],
  biodiversidad: [],
  carbono: [],
  coberturas: [],
  boxes: [
    {
      titleStr: "coberturas",
      title: "",
      subtitle: "",
      position: {
        x: 1,
        y: 1
      },
      content: "Cobertura",
      rowSpan: 2
    },
    {
      titleStr: "biodiversidad",
      title: "",
      subtitle: "",
      position: {
        x: 1,
        y: 3
      },
      content: "Biodiversidad"
    },
    {
      titleStr: "carbono",
      title: "",
      subtitle: "",
      position: {
        x: 1,
        y: 2
      },
      content: "Carbono"
    },
    {
      titleStr: "implementaciones",
      title: "",
      subtitle: "",
      position: {
        x: 2,
        y: 2
      },
      content: "Implementaciones"
    },
    {
      titleStr: "participantes",
      title: "",
      subtitle: "",
      position: {
        x: 2,
        y: 3
      },
      content: "Participantes"
    },
    {
      titleStr: "metas",
      title: "",
      subtitle: "",
      position: {
        x: 3,
        y: 1
      },
      content: "Metas"
    },
    {
      titleStr: "contribuciones",
      title: "",
      subtitle: "",
      position: {
        x: 3,
        y: 2
      },
      content: "Contribuciones"
    },
    {
      titleStr: "aliados",
      title: "",
      subtitle: "",
      position: {
        x: 3,
        y: 3
      },
      content: "Aliados"
    }
  ],
  strings: {
    es: {
      aliados: "Aliados",
      biodiversidad: "Biodiversidad",
      campesinos: "Campesinos",
      carbono: "Carbono",
      carbonoXLabel: "Año",
      carbonoYLabel: "Carbono (MtCO2e)",
      cierreProyecto: "Cierre",
      clasificacionCorine: "Clasificación CORINE",
      clasificacionProyecto: "Clasificación proyecto",
      coberturas: "Coberturas",
      conectorValoresMetas: "de",
      contribuciones: "Contribuciones",
      contribucionesShared: "Shared Conservation Agenda",
      contribucionesOtras: "Otras contribuciones",
      descargarDatos: "Descargar datos",
      descargarImagenes: "Descargar imagenes",
      donantes: "Donantes",
      especies: "especies",
      estrategias: "Estrategias",
      fijacionCompartimiento: "Captura por compartimiento",
      fijacionCobertura: "Captura por cobertura",
      fijacionSolucion: "Captura por Solución Natural de Clima",
      fijacionTotal: "Captura total",
      hombres: "Hombres",
      implementaciones: "Implementaciones",
      implementacionesBosque: "Protección de Ecosistemas Naturales",
      implementacionesRestauracion: "Restauración",
      implementacionesProduccionSostenible: "Producción sostenible",
      implementacionesXLabel: "Área (ha)",
      implementacionesYLabel: "Acción",
      indigenas: "Indígenas",
      individuos: "individuos",
      informacion: "Información",
      infoContent:
        'Este visor, es creado por TNC cuyo objetivo es mostrar la gestion de los proyectos realizados en la region por las estrategias definidas en los proyectos.<br><br>El uso de este visor esta de acuerdo a las politicas de uso de datos definido por TNC el cual especifica el manejo y la propiedad de la informacion aqui expuesta (LINK).<br><br>Si presenta problemas al usar el visor consulte el manual el cual esta disponible en (link)<br>Si esta app pesenta informacion incorrecta  o fallos consulte con (Email) </p><div class="images images--centered"><img src="img/tnc-logo.svg" width="150"><img src="img/dreamgis-logo.png" title="DreamGIS S.A.S"></div>',
      institucionesImplementadoras: "Instituciones implementadoras",
      lineaBase: "Línea base",
      metas: "Metas",
      mujeres: "Mujeres",
      noHayDatos: "Todavía no hay datos :(",
      organizacionesLocales: "Organizaciones locales",
      participantes: "Participantes",
      progreso: "Estado actual",
      sinInformacion: "Sin información",
      socios: "Socios",
      verTodo: "Ver todo"
    },
    en: {
      aliados: "Allies",
      biodiversidad: "Biodiversity",
      campesinos: "Farmers",
      carbono: "Carbon",
      carbonoXLabel: "Year",
      carbonoYLabel: "Carbon (MtCO2e)",
      cierreProyecto: "Closure",
      clasificacionCorine: "CORINE classification",
      clasificacionProyecto: "Project classification",
      coberturas: "Covers",
      conectorValoresMetas: "from",
      contribuciones: "Contributions",
      contribucionesShared: "Shared Conservation Agenda",
      contribucionesOtras: "Other contributions",
      descargarDatos: "Download data",
      descargarImagenes: "Download images",
      donantes: "Donors",
      especies: "species",
      estrategias: "Strategies",
      fijacionCompartimiento: "Capture by compartment",
      fijacionCobertura: "Capture by landcover",
      fijacionSolucion: "Capture by Climate Natural Solution",
      fijacionTotal: "Total capture",
      hombres: "Men",
      implementaciones: "Implementations",
      implementacionesBosque: "Natural Ecosystems Protection",
      implementacionesRestauracion: "Restoration",
      implementacionesProduccionSostenible: "Sustainable production",
      implementacionesXLabel: "Area (ha)",
      implementacionesYLabel: "Action",
      indigenas: "Indigenous",
      individuos: "individuals",
      informacion: "Information",
      infoContent:
        'This viewer is created by TNC whose objective is to show the management of the projects carried out in the region by the strategies defined in the projects.<br><br>If you have problems using the viewer, consult the manual which is available at (link). <br> If this app has incorrect information or errors, please consult (Email)</p><div class="images images--centered"><img src="img/tnc-logo.svg" width="150"><img src="img/dreamgis-logo.png" title="DreamGIS S.A.S"></div>',
      institucionesImplementadoras: "Implementating institutions",
      lineaBase: "Baseline",
      metas: "Milestones",
      mujeres: "Women",
      noHayDatos: "No data yet :(",
      organizacionesLocales: "Local organizations",
      participantes: "Participants",
      progreso: "Current state",
      sinInformacion: "No information",
      socios: "Partners",
      verTodo: "All data"
    }
  },
  filtro: {
    modo: "colombia",
    valor: null,
    year: {
      biodiversidad: null,
      coberturas: null
    },
    moment: "99",
    carbonoField: "total",
    classificationScheme: null,
    contributionType: "0",
    allyType: "0",
    language: "es"
  },
  implementaciones: [],
  estrategias: [],
  regiones: [],
  proyectos: [],
  predios: [],
  colores: [],
  iconos: [],
  metas: [],
  modalVisible: false,
  availableMoments: [
    {
      name: "Línea base",
      value: 0,
      field: "fecha_linea_base"
    },
    {
      name: "Primer seguimiento",
      value: 1,
      field: "fecha_seguimiento1"
    },
    {
      name: "Segundo seguimiento",
      value: 2,
      field: "fecha_seguimiento2"
    },
    {
      name: "Cierre",
      value: 3,
      field: "fecha_cierre"
    }
  ]
};
