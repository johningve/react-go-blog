import { FieldValues, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import { fetchAPI } from "../utils/fetch"

type Response = {
	id: number
}

export function CreatePost() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const navigate = useNavigate()

	const onSubmit = async (data: FieldValues) => {
		const response = await fetchAPI("POST", "/api/post", JSON.stringify(data))
		if (!response.ok) {
			console.error(response)
			return
		}
		const id = ((await response.json()) as Response).id
		navigate(`/post/${id}`)
	}

	return (
		<>
			<h1>Create Post</h1>

			<form onSubmit={handleSubmit(onSubmit)}>
				<label htmlFor="title">Title</label>
				<input type="text" {...register("title", { required: true })} />
				{errors.title?.type === "requried" && <small>Title is required</small>}

				<label htmlFor="content">Title</label>
				<textarea rows={10} {...register("content")} />

				<button type="submit">Create</button>
			</form>
		</>
	)
}
