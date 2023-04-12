package api

import (
	"encoding/base64"
	"net/http"

	"github.com/johningve/react-go-blog/backend/ent"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

type Api struct {
	db *ent.Client
}

func New(db *ent.Client) *Api {
	return &Api{
		db: db,
	}
}

func (api *Api) HandlerSignupPost() echo.HandlerFunc {
	type request struct {
		Name            string `json:"name" validate:"required"`
		Email           string `json:"email" validate:"email,required"`
		Password        string `json:"password" validate:"required,eqfield=ConfirmPassword"`
		ConfirmPassword string `json:"confirm_password" validate:"required"`
	}

	return func(c echo.Context) error {
		var request request

		if err := c.Bind(&request); err != nil {
			return echo.ErrBadRequest.WithInternal(err)
		}

		if err := c.Validate(&request); err != nil {
			return echo.ErrBadRequest.WithInternal(err)
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
		if err != nil {
			return echo.ErrInternalServerError.WithInternal(err)
		}

		err = api.db.User.Create().
			SetName(request.Name).
			SetEmail(request.Email).
			SetSecret(base64.StdEncoding.EncodeToString(hash)).
			Exec(c.Request().Context())
		if err != nil {
			return echo.ErrInternalServerError.WithInternal(err)
		}

		return c.JSON(http.StatusCreated, struct{}{})
	}
}
