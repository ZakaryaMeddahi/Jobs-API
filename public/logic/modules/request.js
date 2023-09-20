
const request = (endpoint, method, data) => {
  return fetch(endpoint, {
    method,
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(data)
  })
}

export default request