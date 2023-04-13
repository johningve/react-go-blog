import { useEffect, useState } from "react"

import { fetchAPI } from "../utils/fetch"

interface UserDTO {
	name: string
	email: string
}

export default function Root() {
	const [user, setUser] = useState<UserDTO | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetchAPI("GET", "/api/user")
			if (response.ok) {
				setUser((await response.json()) as UserDTO)
			}
		}
		fetchData().catch(console.error)
	}, [])

	return user ? <h1>Welcome, {user.name}</h1> : <h1>Welcome</h1>
}
