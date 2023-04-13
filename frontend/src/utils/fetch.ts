export function fetchAPI(method: string, path: string, body?: string): Promise<Response> {
	return fetch(path, {
		method,
		body,
		mode: "same-origin",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
	})
}
