import { useEffect } from 'react'


export default () => {

  const forceWindowFocus = (event) => {
    if (event.currentTarget === event.target) {
      window.focus() // FF
      setTimeout(window.focus, 20) // Chrome
    }

    return true
  }

  useEffect(() => {
    window.addEventListener('blur', forceWindowFocus)
    return () => window.removeEventListener('blur', forceWindowFocus)
  })

}
