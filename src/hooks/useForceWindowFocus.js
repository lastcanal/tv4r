import { useEffect } from 'react'

const forceWindowFocus = (event) => {
  if (event.currentTarget === event.target) {
    window.focus() // FF
    setTimeout(window.focus, 20) // Chrome
  }
}

export default () => {
  useEffect(() => {
    window.addEventListener('blur', forceWindowFocus)
    return () => window.removeEventListener('blur', forceWindowFocus)
  })

}
