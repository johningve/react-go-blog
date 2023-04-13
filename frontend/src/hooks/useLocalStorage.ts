import { useState } from "react"

// source: https://blog.logrocket.com/complete-guide-authentication-with-react-router-v6/

export function useLocalStorage<T>(keyName: string, defaultValue: T): [T, (value: T) => void] {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const value = window.localStorage.getItem(keyName)
			if (value) {
				return JSON.parse(value)
			} else {
				window.localStorage.setItem(keyName, JSON.stringify(defaultValue))
				return defaultValue
			}
		} catch (err) {
			return defaultValue
		}
	})
	const setValue = (newValue: T) => {
		try {
			window.localStorage.setItem(keyName, JSON.stringify(newValue))
		} catch (err) {
			console.error(err)
		}
		setStoredValue(newValue)
	}
	return [storedValue, setValue]
}
