import { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { Navigate } from "react-router-dom"

import { fetchAPI } from "../utils/fetch"

export default function SignIn() {
	const [redirect, setRedirect] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const onSubmit = async (data: FieldValues) => {
		const response = await fetchAPI("POST", "/api/signin", JSON.stringify(data))
		if (!response.ok) {
			console.error(response)
			return
		}
		setRedirect(true)
	}

	if (redirect) {
		return <Navigate replace to="/" />
	}

	return (
		<>
			<h1>Sign In</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<label htmlFor="email">E-mail</label>
				<input type="email" {...register("email", { required: true })} />
				{errors.email?.type === "required" && <small>Email is required</small>}

				<label htmlFor="password">Password</label>
				<input type="password" {...register("password", { required: true })} />
				{errors.password?.type === "required" && <small>Password is required</small>}

				<input type="submit" />
			</form>
		</>
	)
}
