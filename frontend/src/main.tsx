import "@picocss/pico"
import React from "react"
import ReactDOM from "react-dom/client"
import { Route, RouterProvider, Routes, createBrowserRouter, createRoutesFromElements } from "react-router-dom"

import "./main.css"
import Layout from "./pages/Layout"
import Root from "./pages/Root"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route element={<Layout />}>
			<Route path="/" element={<Root />} />
			<Route path="/signup" element={<SignUp />} />
			<Route path="/signin" element={<SignIn />} />
		</Route>,
	),
)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)
