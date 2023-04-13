import { PropsWithChildren } from "react"
import { Navigate } from "react-router-dom"

import { useAuth } from "../hooks/useAuth"

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
	const { user } = useAuth()
	if (!user) {
		// user is not authenticated
		return <Navigate to="/" />
	}
	return <>children</>
}
