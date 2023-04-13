import { NavLink, Outlet } from "react-router-dom"

import { NavBar } from "./../components/NavBar"

export function Layout() {
	return (
		<>
			<header>
				<NavBar />
			</header>
			<main className="container">
				<Outlet />
			</main>
			<footer>
				<small>Copyright &copy; 2023 John Ingve Olsen</small>
			</footer>
		</>
	)
}
