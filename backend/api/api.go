package api

import (
	"github.com/johningve/react-go-blog/backend/ent"
)

type Api struct {
	db *ent.Client
}

func New(db *ent.Client) *Api {
	return &Api{
		db: db,
	}
}
