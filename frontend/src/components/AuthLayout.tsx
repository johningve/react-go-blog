import { Suspense } from "react"
import { Await, useLoaderData, useOutlet } from "react-router-dom"

import { AuthProvider, UserData } from "../hooks/useAuth"

type LoaderData = {
	userPromise: Promise<UserData>
}

export const AuthLayout = () => {
	const outlet = useOutlet()

	const { userPromise } = useLoaderData() as LoaderData

	return (
		<Suspense>
			<Await resolve={userPromise} errorElement={<p>Something went wrong!</p>}>
				{(user) => <AuthProvider userData={user}>{outlet}</AuthProvider>}
			</Await>
		</Suspense>
	)
}
