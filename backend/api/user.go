package api

import (
	"net/http"

	"github.com/johningve/react-go-blog/backend/auth"
	"github.com/johningve/react-go-blog/backend/ent/user"
	"github.com/labstack/echo/v4"
)

func (api *Api) HandlerUserGet() echo.HandlerFunc {
	type response struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	return func(c echo.Context) error {
		id, err := auth.GetUserID(c)
		if err != nil {
			return echo.ErrInternalServerError.WithInternal(err)
		}

		user, err := api.db.User.Query().
			Where(user.ID(id)).
			Only(c.Request().Context())

		if err != nil {
			return echo.ErrInternalServerError.WithInternal(err)
		}

		return c.JSON(http.StatusOK, response{Name: user.Name, Email: user.Email})
	}
}
