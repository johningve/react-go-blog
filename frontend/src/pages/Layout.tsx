import { NavLink, Outlet } from "react-router-dom"

export default function Layout() {
	return (
		<>
			<header>
				<nav>
					<ul>
						<li>
							<strong>Blog</strong>
						</li>
						<li>
							<NavLink to="/">Home</NavLink>
						</li>
					</ul>
					<ul>
						<li>
							<NavLink to="/signin">Sign In</NavLink>
						</li>
						<li>
							<NavLink to="/signup">Sign Up</NavLink>
						</li>
					</ul>
				</nav>
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
