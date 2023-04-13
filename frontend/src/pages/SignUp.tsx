import { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { Navigate } from "react-router-dom"

export default function SignUp() {
	const [redirect, setRedirect] = useState(false)

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm()

	const onSubmit = async (data: FieldValues) => {
		const response = await fetch("/api/signup", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})

		if (response.ok) {
			setRedirect(true)
		} else {
			console.log(response)
		}
	}

	if (redirect) {
		return <Navigate replace to="/" />
	}

	return (
		<>
			<h1>Sign Up</h1>

			<form onSubmit={handleSubmit(onSubmit)}>
				<label htmlFor="name">Name</label>
				<input {...register("name", { required: true })} />
				{errors.name?.type === "required" && <small>Name is required</small>}

				<label htmlFor="email">E-mail</label>
				<input type="email" {...register("email", { required: true })} />
				{errors.email?.type === "required" && <small>Email is required</small>}

				<label htmlFor="password">Password</label>
				<input type="password" {...register("password", { required: true })} />
				{errors.password?.type === "required" && <small>Password is required</small>}

				<label htmlFor="confirmPassword">Confirm Password</label>
				<input
					type="password"
					{...register("confirmPassword", {
						required: true,
						validate: (val: string) => {
							if (watch("password") != val) {
								return "Your passwords do not match"
							}
						},
					})}
				/>
				{errors.confirmPassword?.type === "required" && <small>Confirm Password is required</small>}
				{errors.confirmPassword?.type === "validate" && <small>Passwords must match</small>}

				<input type="submit" />
			</form>
		</>
	)
}
