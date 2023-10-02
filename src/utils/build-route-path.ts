// 1 - /tasks/:id -> /tasks/821480124
// 2 - { id: 821480124, query: { key: value } ... }

export function buildRoutePath(path: string) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replace(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)
  return pathRegex
}