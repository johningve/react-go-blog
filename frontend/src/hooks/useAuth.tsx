import { PropsWithChildren, createContext, useContext, useMemo } from "react"
import { useNavigate } from "react-router-dom"

import { useLocalStorage } from "./useLocalStorage"

// source: https://blog.logrocket.com/complete-guide-authentication-with-react-router-v6/

export type AuthContextType = {
	user: string | null
	login: (data: string) => void
	logout: () => void
}

const authContextDefaultValue: AuthContextType = {
	user: null,
	login: () => {
		// do nothing.
	},
	logout: () => {
		// do nothing.
	},
}

export const AuthContext = createContext<AuthContextType>(authContextDefaultValue)

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [user, setUser] = useLocalStorage<string | null>("user", null)
	const navigate = useNavigate()

	// call this function when you want to authenticate the user
	const login = (data: string) => {
		setUser(data)
		navigate("/profile")
	}

	// call this function to sign out logged in user
	const logout = () => {
		setUser(null)
		navigate("/", { replace: true })
	}

	const value = useMemo(
		() => ({
			user,
			login,
			logout,
		}),
		// TODO: investigate the following linter warning:
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[user],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	return useContext(AuthContext)
}
