import { NavLink } from "react-router-dom"

import { useAuth } from "../hooks/useAuth"
import { fetchAPI } from "../utils/fetch"

export function NavBar() {
	const { user, logout } = useAuth()

	const signOut = () => {
		fetchAPI("POST", "/api/signout")
			.then((res) => (res.ok ? logout() : console.error(res)))
			.catch(console.error)
	}

	return (
		<nav>
			<ul>
				<li>
					<strong>Blog</strong>
				</li>
				<li>
					<NavLink to="/">Home</NavLink>
				</li>
			</ul>
			{user ? (
				<ul>
					<li>
						<NavLink to="/profile">Profile</NavLink>
					</li>
					<li>
						<NavLink onClick={signOut} to="/">
							Sign Out
						</NavLink>
					</li>
				</ul>
			) : (
				<ul>
					<li>
						<NavLink to="/signin">Sign In</NavLink>
					</li>
					<li>
						<NavLink to="/signup">Sign Up</NavLink>
					</li>
				</ul>
			)}
		</nav>
	)
}
