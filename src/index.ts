import { Kv, HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk"

// Main request handler
export const handleRequest: HandleRequest = async function (request: HttpRequest): Promise<HttpResponse> {
  // Count the views
  let count = await logRequest(request.uri);

  // Construct the body and return
  let body = `The path ${request.uri} has been accessed ${count} time(s).`
  return {
    status: 200,
    body: body
  }
}

// Log a request and return the number of views on this path
const logRequest = async function (path: string): Promise<number> {
  let store = Kv.openDefault()

  // If there is already a record for this path, updated it and re-store it.
  if (store.exists(path)) {
    let view = store.getJson(path)
    view.count++
    store.setJson(path, view)
    return view.count;
  }

  // Otherwise, create a new record for this path.
  let new_view: PageView = {
    path: path,
    count: 1
  }
  store.setJson(path, new_view)
  return 1
}

// The class for storing page views
class PageView {
  path: string = "";
  count: number = 0;
}
