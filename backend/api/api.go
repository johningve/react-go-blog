package api

import (
	"github.com/johningve/react-go-blog/backend/ent"
	"github.com/labstack/echo/v4"
)

type Api struct {
	db *ent.Client
}

func New(db *ent.Client) *Api {
	return &Api{
		db: db,
	}
}

func BindAndValidate[T any](c echo.Context, val *T) error {
	if err := c.Bind(val); err != nil {
		return err
	}
	if err := c.Validate(val); err != nil {
		return err
	}
	return nil
}
