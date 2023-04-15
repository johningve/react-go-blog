import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { fetchAPI } from "../utils/fetch"

type PostParams = {
	id: string
}

type PostDTO = {
	title: string
	content: string
	author: string
	createdAt: string
	updatedAt: string
}

export function Post() {
	const { id } = useParams<PostParams>()
	const [post, setPost] = useState<PostDTO | null>(null)

	useEffect(() => {
		fetchAPI("GET", `/api/post/${id}`)
			.then((resp) => (resp.ok ? resp.json() : null))
			.then((data) => setPost(data as PostDTO))
			.catch((err) => console.error(err))
	}, [id])

	if (!post) {
		return <p>Loading ...</p>
	}

	return (
		<article>
			<header>
				<h1>{post.title}</h1>
				<small>Posted by {post.author}</small>
			</header>
			<p>{post.content}</p>
		</article>
	)
}
