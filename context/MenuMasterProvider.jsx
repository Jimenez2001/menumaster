import { useState, useEffect, createContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'//Para las notificaciones
import { useRouter } from 'next/router'//Para usar las rutas

const MenuMasterContext = createContext()


const MenuMasterProvider = ({children}) => {
    const [categorias, setCategorias] = useState([])//Para mandar a traer categorias
    const [categoriaActual, setCategoriaActual] = useState({})//Para saber a que categoria actual estamos
    const [producto, setProducto] = useState({}) //Para mandar a traer los productos
    const [modal, setModal] = useState(false) //Para mandar a traer los productos
    const [pedido, setPedido] = useState([])//Para agregar los productos a un pedido
    const [nombre, setNombre] = useState('')//Para que enviemos el nombre del mesero
    const [total, setTotal] = useState(0)//Para hacer el total del pedido

    const router = useRouter()//Mando a llamar la libreria router

    const obtenerCategorias = async () => {
        const {data} = await axios('/api/categorias')//extraer las imágenes de las categorias
        setCategorias(data)
    }
    useEffect(() => {
        obtenerCategorias()
    }, [])
    
    useEffect(() => {
        setCategoriaActual(categorias[0])//Para que la categoria por defecto sea 0
    }, [categorias])

    useEffect(() => {//Cada que que cambie un pedido se actualice el total
        const nuevoTotal = pedido.reduce((total, producto) => (producto.precio * producto.cantidad )
        + total, 0)
        setTotal(nuevoTotal)
    }, [pedido])

    const handleClickCategoria = id => {//funcion al dar click ver categoria actual
        const categoria = categorias.filter( cat => cat.id === id )//Para filtrar cuando la categoria es igual al id que queremos nos jale las categorias
        setCategoriaActual(categoria[0]);
        router.push('/')//Para que al dar click a una categoría siempre lo manda al menu principal
    }

    const handleSetProducto = producto => {//Funcion para que setProducto envie los datos al darle click a algun producto
        setProducto(producto)
    }

    const handleChangeModal = () => {//Función que mostrará el modal dónde saldra la descripción de los pedidos
        setModal(!modal)
    }

    const handleAgregarPedido = ({categoriaId, ...producto}) => {//Funcion para enviar los productos al pedido
        if(pedido.some(productoState => productoState.id === producto.id)) {//Para comprobar si el pedido ya existe y no duplicar todos los registros y actualizar la cantidad
            //Actualizar la cantidad
            const pedidoActualizado = pedido.map(productoState => productoState.id ===
            producto.id ? producto : productoState)
            setPedido(pedidoActualizado)
            toast.success('Guardado correctamente')
        } else {
            //Pedido agregado
            setPedido([...pedido, producto])
            toast.success('Agregado al pedido')
        }
        setModal(false)//Para cerrar el modal cuando se agrege el pedido
    }

    const handleEditarCantidades = id => {
        const productoActualizar = pedido.filter( producto => producto.id === id )
        setProducto(productoActualizar[0])//Filtra el producto que se envia al modal dependiendo del id del pedido al que hacemos click
        setModal(!modal)//Muestra el modal
    }

    const handleEliminarProducto = id => {//Para elminar el pedido del producto
        const pedidoActualizado = pedido.filter( producto => producto.id !== id)
        setPedido(pedidoActualizado)
    }

    const colocarOrden = async (e) => {//Detallamos que hará la función detallara orden
        e.preventDefault();

        try {//La función que permitira envio de datos a la API
            await axios.post('/api/ordenes', {pedido, nombre, total,
            fecha: Date.now().toString()})

            //Resetear la app
            setCategoriaActual(categorias[0]);//Para regresar a la primer categoria
            setPedido([]);//Para que el pedido vuelva a estar vacío
            setNombre('');//Para que el nombre vuelva a estar vacía
            setTotal(0);//Para que el total vuela a ser 0
            
            //Mostrar alerta
            toast.success('Pedido Exitoso')

            //Regresa al mesero al menú de inicio
            setTimeout(() => {
                router.push('/')
            }, 3000)

        } catch (error) {
            console.log(error);
        }

        //Valores que enviaremos a la API
        /* console.log(pedido);
        console.log(nombre);
        console.log(total); */
    }



    return(
        <MenuMasterContext.Provider
            value={{
                categorias,
                categoriaActual,
                handleClickCategoria,
                producto,
                handleSetProducto,
                modal,
                handleChangeModal,
                handleAgregarPedido,
                pedido,
                handleEditarCantidades,
                handleEliminarProducto,
                nombre,
                setNombre,
                colocarOrden,
                total
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