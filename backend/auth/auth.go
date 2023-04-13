package auth

import (
	"errors"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"github.com/johningve/react-go-blog/backend/ent"
	"github.com/labstack/echo/v4"
)

const (
	TokenCookieName = "access-token"
	// FIXME: get from ENV
	jwtSecretKey = "my-secret-key"
)

func GetJWTSecret() string {
	return jwtSecretKey
}

type Claims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

func GenerateTokenAndSetCookie(c echo.Context, user *ent.User) error {
	accessToken, exp, err := generateAccessToken(user)
	if err != nil {
		return err
	}
	setTokenCookie(c, accessToken, exp)
	return nil
}

func generateAccessToken(user *ent.User) (string, time.Time, error) {
	expirationTime := time.Now().AddDate(0, 1, 0)
	return generateToken(user, expirationTime, []byte(GetJWTSecret()))
}

func generateToken(user *ent.User, expirationTime time.Time, secret []byte) (string, time.Time, error) {
	claims := &Claims{
		UserID: user.ID.String(),
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(secret)
	if err != nil {
		return "", time.Time{}, err
	}

	return tokenString, expirationTime, nil
}

func setTokenCookie(c echo.Context, token string, expirationTime time.Time) {
	cookie := http.Cookie{
		Name:     TokenCookieName,
		Value:    token,
		Path:     "/",
		Expires:  expirationTime,
		HttpOnly: true,                    // offers XSS protection (for the JWT token)
		SameSite: http.SameSiteStrictMode, // offers CSRF protection
	}
	c.SetCookie(&cookie)
}

func DeleteTokenCookie(c echo.Context) {
	cookie := http.Cookie{
		Name:     TokenCookieName,
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
	}
	c.SetCookie(&cookie)
}

func GetUserID(c echo.Context) (uuid.UUID, error) {
	user := c.Get("user").(*jwt.Token)
	if user == nil {
		return uuid.UUID{}, errors.New("user token not found")
	}
	claims := user.Claims.(*Claims)
	id, err := uuid.Parse(claims.UserID)
	if err != nil {
		return uuid.UUID{}, err
	}
	return id, nil
}
