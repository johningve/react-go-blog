package main

import (
	"context"
	"fmt"
	"os"

	"github.com/johningve/react-go-blog/backend/api"
	"github.com/johningve/react-go-blog/backend/ent"
	"github.com/johningve/react-go-blog/backend/validator"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run() error {
	db, err := initDB()
	if err != nil {
		return err
	}

	api := api.New(db)

	e := echo.New()
	e.Logger.SetLevel(log.DEBUG)
	e.Validator = validator.New()
	e.Use(middleware.Logger())
	e.Use(middleware.CSRF())

	e.POST("/signup", api.HandlerSignupPost())
	// e.POST("/login", api.HandlerLoginPost())

	return e.Start(":8080")
}

func initDB() (*ent.Client, error) {
	client, err := ent.Open("sqlite3", "file:dev.db?cache=shared&_fk=1")
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	// automatic migrations
	if err := client.Schema.Create(context.Background()); err != nil {
		client.Close()
		return nil, fmt.Errorf("failed creating schema resources: %w", err)
	}
	return client, nil
}
