// 1 - ?search=Fischer&name=Fischer
// 2 - search=Fischer&name=Fischer
// 3 - [search=Fischer], [name=Fischer]
// 4 - [search, Fischer] => { search: Fischer} ...

export function extractRouteParams(query: string) {
  return query.substr(1).split('&').reduce((queryParams, item) => {
    const [key, value] = item.split('=');
    queryParams[key] = value

    return queryParams
  }, {})
}