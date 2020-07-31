import Cookies from 'js-cookie'

let TokenKey = 'token'

export function getToken() {
  // return sessionStorage.getItem(TokenKey)
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  // return sessionStorage.setItem(TokenKey, token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  // sessionStorage.removeItem(TokenKey)
  return Cookies.remove(TokenKey)
}
