import { useState, useEffect, createContext } from 'react'
import axios from 'axios'

const MenuMasterContext = createContext()


const MenuMasterProvider = ({children}) => {
    const [categorias, setCategorias] = useState([])

    const obtenerCategorias = async () => {
        const {data} = await axios('/api/categorias')
        setCategorias(data)
    }
    useEffect(() => {
        obtenerCategorias()
    }, [])

    return(
        <MenuMasterContext.Provider
            value={{
                categorias
            }}
        >
            {children}
        </MenuMasterContext.Provider>
    )

}
export {
    MenuMasterProvider
}
export default MenuMasterContext