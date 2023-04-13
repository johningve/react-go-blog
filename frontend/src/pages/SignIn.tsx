import { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { Navigate } from "react-router-dom"

import { UserData, useAuth } from "../hooks/useAuth"
import { fetchAPI } from "../utils/fetch"

export function SignIn() {
	const { login } = useAuth()

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
		login((await response.json()) as UserData)
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
