import React, { useState } from 'react'
import { createContext } from 'react'
export const GlobalContext = createContext(null)
const GlobalState = ({ children }) => {
    const [showLoginView, setShowLoginView] = useState(false)
    const [currentUserName, setCurrentUsername] = useState('')
    return (
        <GlobalContext.Provider value={{ showLoginView, setShowLoginView }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalState