import "@picocss/pico"
import React from "react"
import ReactDOM from "react-dom/client"
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, defer } from "react-router-dom"

import { AuthLayout } from "./components/AuthLayout"
import { ProtectedLayout } from "./components/ProtectedLayout"
import { CreatePost } from "./pages/CreatePost"
import { Layout } from "./pages/Layout"
import { Post } from "./pages/Post"
import { Profile } from "./pages/Profile"
import { Root } from "./pages/Root"
import { SignIn } from "./pages/SignIn"
import { SignUp } from "./pages/SignUp"
import { fetchAPI } from "./utils/fetch"

const getUserData = () => {
	fetchAPI("GET", "/api/user").then((resp) => (resp.ok ? resp.json() : null))
}

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route element={<AuthLayout />} loader={() => defer({ userPromise: getUserData() })}>
			<Route element={<Layout />}>
				<Route path="/" element={<Root />} />
				<Route path="/signout" element={<Root />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/signin" element={<SignIn />} />
				<Route path="/post/:id" element={<Post />} />
				<Route element={<ProtectedLayout />}>
					<Route path="/profile" element={<Profile />} />
					<Route path="/new" element={<CreatePost />} />
				</Route>
			</Route>
		</Route>,
	),
)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)
