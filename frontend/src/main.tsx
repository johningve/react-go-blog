import "@picocss/pico"
import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider, createBrowserRouter } from "react-router-dom"

const router = createBrowserRouter([
	{
		path: "/",
		element: <div>Hello world!</div>,
	},
	{
		path: "/signup",
		element: "Signup",
	},
	{
		path: "/login",
		element: "Login",
	},
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)
