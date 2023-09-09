//Este componenete es llamado para mostrarse en cocina
import Image from "next/image";//Importamos las imagenes para poder verlas en el panel de cocina
import axios from "axios";// se utiliza para realizar solicitudes HTTP (por ejemplo, solicitudes GET, POST, PUT, DELETE, etc.) desde el lado del cliente
import { toast } from 'react-toastify'//Para usar las alertas toastify
import { formatearDinero } from '../helpers'//Para mostrar el total en Quetzales

export default function Orden({orden}) {
    const {id, nombre, total, pedido, fecha} = orden//Declaramos los valores que queremos mostrar
    
    const completarOrden = async () => {//Funcion que usamos en el boton para actualizar el estado del pedido
        try {
            const confirmacion = window.confirm('Está seguro de completar esta orden?')
            if (confirmacion) {
                const data = await axios.post(`/api/ordenes/${id}`)
                toast.success('Orden Lista')
            }
            
        } catch (error) {
            toast.error('Hubo un error')
        }
    }
    
    return (
        <div className="border p-10 space-y-5">
            <h3 className="text-2xl font-bold">Orden: {id} </h3>
            <p className="text-lg font-bold">Mesero: {nombre}</p>
            <div 
                className="p-5 space-y-2"//Para mostrar la fecha del pedido
            >
                <p className="text-lg font-bold">Fecha: {fecha}</p> 
            </div>

            <div>
                {pedido.map(platillo =>(//Creamos la variable platillo para almacenar la descripcion de cada plato del pedido
                    <div key={platillo.id} className="py-3 flex border-b last-of-type:border-0 items-center">
                        <div className="w-32">
                            <Image
                                width={400}//Mostramos y damos tamaño a la imagen de cada orden
                                height={500}
                                src={`/assets/img/${platillo.imagen}.jpg`}
                                alt={`Imagen Platillo ${platillo.nombre}`}
                            />
                        </div>

                        <div className="p-5 space-y-2">
                            <p className="text-lg font-bold">Cantidad: {platillo.cantidad}</p>
                            <h4 className="text-xl font-bold text-amber-500">
                                {
                                    platillo.nombre//Aqui mostramos el nombre del platillo
                                }
                            </h4>
                            
                        </div>
                        
                       {/*  <div className="p-5 space-y-2"> ESTE SIRVE PARA MANDAR EL PRECIO DE CADA PRODUCTO UNITARIO
                            <p className="text-xl font-bold text-amber-600">
                                Precio unitario: {formatearDinero(platillo.precio)}
                            </p>
                        </div> */}

                    </div>
                ))}
            </div>
            
            <div className="md:flex md:items-center md:justify-between my-10"> 
                {/* <p className="mt-5 font-black text-4xl text-amber-600"> ESTE SIRVE PARA MOSTRAR EL TOTAL DEL PEDIDO
                    Total a Pagar: {formatearDinero(total)}
                </p> */}

                <button //Boton para actualizar el estado de de los pedidos
                    className="bg-indigo-600 hover:bg-indigo-800 text-white mt-5 md:mt-0 py-3 px-10 uppercase
                    font-bold rounded-lg"
                    type="button"
                    onClick={completarOrden}
                >
                    Completar Orden
                </button>
            </div>

        </div>
    )
}
