export function buildQuery(filter = {}) {
  return `query?where=1%3D1&outFields=${
    filter.outFields ? filter.outFields : "*"
  }&returnGeometry=false&returnExceededLimitFeatures=true&f=json`;
}
