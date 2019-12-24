export default {
  colorPorCobertura: (state) => (idCobertura) => {
    return state.colores.find(color => color.ID_cobertura === idCobertura).color;
  }
}