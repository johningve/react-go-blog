package api_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/johningve/react-go-blog/backend/api"
	"github.com/johningve/react-go-blog/backend/ent/enttest"
	"github.com/johningve/react-go-blog/backend/validator"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"

	_ "github.com/mattn/go-sqlite3"
)

func TestSignupPost(t *testing.T) {
	type request struct {
		Name            string `json:"name" validate:"required"`
		Email           string `json:"email" validate:"email,required"`
		Password        string `json:"password" validate:"required,eqfield=ConfirmPassword"`
		ConfirmPassword string `json:"confirm_password" validate:"required"`
	}

	const (
		name     = "John Doe"
		email    = "test@example.org"
		password = "password"
	)

	shouldFail := []request{
		{},
		{"", email, password, password},
		{name, "", password, password},
		{name, email, password, "wrongpassword"},
	}

	shouldPass := []request{
		{name, email, password, password},
	}

	e := echo.New()
	e.Validator = validator.New()

	db := enttest.Open(t, "sqlite3", "file:ent?mode=memory&_fk=1")
	defer db.Close()

	api := api.New(db)

	h := api.HandlerSignupPost()

	run := func(requests []request, pass bool) {
		for _, request := range requests {
			body, err := json.Marshal(request)
			assert.NoError(t, err)
			req := httptest.NewRequest(http.MethodPost, "/register", bytes.NewReader(body))
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			c := e.NewContext(req, rec)

			err = h(c)

			if pass {
				assert.NoError(t, err)
				assert.Equal(t, http.StatusCreated, rec.Code)
			} else {
				assert.Error(t, err)
				assert.NotEqual(t, http.StatusCreated, rec.Code)
			}

			if t.Failed() {
				t.Log(request)
			}
		}
	}

	run(shouldFail, false)
	run(shouldPass, true)
}
