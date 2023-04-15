import { Outlet } from "react-router-dom"

import { NavBar } from "./../components/NavBar"
import LayoutCSS from "./Layout.module.css"

export function Layout() {
	return (
		<div className={LayoutCSS["root"]}>
			<header>
				<NavBar />
			</header>
			<main className="container">
				<Outlet />
			</main>
			<footer>
				<small>Copyright &copy; 2023 John Ingve Olsen</small>
			</footer>
		</div>
	)
}
