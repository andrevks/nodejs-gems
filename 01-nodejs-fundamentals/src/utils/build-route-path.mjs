
// /users/:id
export function buildRoutePath(path) {
  // regex to identify the params with ":"
  const routeParametersRegex = /:([a-zA-Z]+)/g
  // replace the format found in another regex to identify params dynamically
  const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)
  return pathRegex
}