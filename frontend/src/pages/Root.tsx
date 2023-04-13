import { useAuth } from "../hooks/useAuth"

export function Root() {
	const { user } = useAuth()

	return <>{user ? <h1>Welcome, {user.name}</h1> : <h1>Welcome</h1>}</>
}
