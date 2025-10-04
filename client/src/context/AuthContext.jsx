import {createContext} from 'react'

export const Appcontext = createContext();

export const AppContextProvider = ({children}) => {
    const value = {

    };
    return(
        <Appcontext.Provider value = {value}>
            {children}
        </Appcontext.Provider>
    )
}
