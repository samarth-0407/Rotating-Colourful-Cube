const COr8PPso_cache = {}

async function cachedLoad(url, resolveAs='json') {
  let contents

  if (url instanceof URL === false) {
    url = new URL(url, window.location)
  }
  if (url.href in COr8PPso_cache === false) {
    contents = await fetch(url)

    switch(resolveAs.toLowerCase()) {
    case 'arraybuffer' :
    case 'array_buffer' :
    case 'array-buffer' :
      contents = await contents.arrayBuffer()
      break

    case 'blob' :
      contents = await contents.blob()
      break

    case 'formdata' :
    case 'form-data' :
    case 'form_data' :
      contents = await contents.formData()
      break

    case 'json' :
      contents = await contents.json()
      break

    case 'text' :
    default :
      contents = await contents.text()
      break
    }

    COr8PPso_cache[url.href] = contents
  }

  return COr8PPso_cache[url.href]
}
