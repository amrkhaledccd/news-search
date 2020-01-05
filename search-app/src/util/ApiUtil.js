const API_BASE_URL = "http://localhost:8080";

const request = options => {
  const headers = new Headers();

  if (options.setContentType !== false) {
    headers.append("Content-Type", "application/json");
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then(response =>
    response.json().then(json => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

export function search(query, page, filter) {
  return request({
    url:
      API_BASE_URL + "/_search?q=" + query + "&page=" + page + "&f=" + filter,
    method: "GET"
  });
}

export function autocomplete(prefix, filter) {
  var url = API_BASE_URL + "/_autocomplete?prefix=" + prefix;

  if (filter && filter !== "") {
    url += "&f=" + filter;
  }
  console.log(url);

  return request({
    url: url,
    method: "GET"
  });
}
