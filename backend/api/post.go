package api

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/johningve/react-go-blog/backend/auth"
	"github.com/johningve/react-go-blog/backend/ent"
	"github.com/johningve/react-go-blog/backend/ent/post"
	"github.com/johningve/react-go-blog/backend/ent/user"
	"github.com/labstack/echo/v4"
)

func (api *Api) HandlerPostCreate() echo.HandlerFunc {
	type request struct {
		Title   string `json:"title" validate:"required"`
		Content string `json:"content"`
	}

	type response struct {
		ID int `json:"id"`
	}

	return func(c echo.Context) error {
		var request request
		if err := BindAndValidate(c, &request); err != nil {
			return echo.ErrBadRequest.WithInternal(err)
		}

		userID, err := auth.GetUserID(c)
		if err != nil {
			return echo.ErrInternalServerError.WithInternal(err)
		}

		content := (*string)(nil)
		if request.Content != "" {
			content = &request.Content
		}

		post, err := api.db.Post.Create().
			SetTitle(request.Title).
			SetNillableContent(content).
			SetUserID(userID).
			Save(c.Request().Context())
		if err != nil {
			return echo.ErrInternalServerError.WithInternal(err)
		}

		return c.JSON(http.StatusCreated, response{post.ID})
	}
}

func (api *Api) HandlerPostGet() echo.HandlerFunc {
	type response struct {
		Title     string `json:"title"`
		Content   string `json:"content"`
		Author    string `json:"author"`
		CreatedAt string `json:"createdAt"`
		UpdatedAt string `json:"updatedAt"`
	}

	return func(c echo.Context) error {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			return echo.ErrBadRequest.WithInternal(err)
		}

		post, err := api.db.Post.Query().
			Where(post.ID(id)).
			WithUser(func(uq *ent.UserQuery) {
				uq.Select(user.FieldName)
			}).
			Select(post.FieldTitle, post.FieldContent, post.FieldCreatedAt, post.FieldUpdatedAt).
			Only(c.Request().Context())
		if errors.Is(err, &ent.NotFoundError{}) {
			return echo.ErrNotFound.WithInternal(err)
		} else if err != nil {
			return echo.ErrInternalServerError.WithInternal(err)
		}

		return c.JSON(http.StatusOK, response{
			Title:     post.Title,
			Content:   post.Content,
			Author:    post.Edges.User.Name,
			CreatedAt: post.CreatedAt.String(),
			UpdatedAt: post.UpdatedAt.String(),
		})
	}
}
