package api

import (
	"encoding/base64"
	"errors"
	"net/http"

	"github.com/johningve/react-go-blog/backend/auth"
	"github.com/johningve/react-go-blog/backend/ent"
	"github.com/johningve/react-go-blog/backend/ent/user"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

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

func (api *Api) HandlerLoginPost() echo.HandlerFunc {
	type request struct {
		Email    string `json:"email" validate:"email,required"`
		Password string `json:"password" validate:"required"`
	}

	return func(c echo.Context) error {
		var request request

		if err := c.Bind(&request); err != nil {
			return echo.ErrBadRequest.WithInternal(err)
		}

		if err := c.Validate(&request); err != nil {
			return echo.ErrBadRequest.WithInternal(err)
		}

		user, err := api.db.User.Query().
			Where(user.Email(request.Email)).
			Only(c.Request().Context())
		if errors.Is(err, &ent.NotFoundError{}) {
			return echo.ErrNotFound.WithInternal(err)
		} else if err != nil {
			return echo.ErrInternalServerError.WithInternal(err)
		}

		err = bcrypt.CompareHashAndPassword([]byte(request.Password), []byte(user.Secret))
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return echo.ErrUnauthorized.WithInternal(err)
		} else if err != nil {
			return echo.ErrInternalServerError.WithInternal(err)
		}

		err = auth.GenerateTokenAndSetCookie(c, user)
		if err != nil {
			return echo.ErrInternalServerError.WithInternal(err)
		}

		return c.JSON(http.StatusOK, struct{}{})
	}
}

func (api *Api) HandlerSignoutPost() echo.HandlerFunc {
	return func(c echo.Context) error {
		auth.DeleteTokenCookie(c)
		return c.JSON(http.StatusOK, struct{}{})
	}
}
