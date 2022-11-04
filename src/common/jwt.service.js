const TOKEN_ID = "accessToken"
const DESIG_ID = "designation"

export const getJWT = () => {
  return window.localStorage.getItem(TOKEN_ID)
}

export const setJWT = (tok) => {
  return window.localStorage.setItem(TOKEN_ID, tok)
}

export const purgeJWT = () => {
  return window.localStorage.removeItem(TOKEN_ID)
}

export const getLocalDesignation = () => {
  return window.localStorage.getItem(DESIG_ID)
}

export const setLocalDesignation = (des) => {
  return window.localStorage.setItem(DESIG_ID, des)
}

export const purgeLocalDesignation = () => {
  return window.localStorage.removeItem(DESIG_ID)
}

export const purgeLocalIdentity = () => {
  purgeJWT()
  purgeLocalDesignation()
}
