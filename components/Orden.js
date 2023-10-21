//Este componenete es llamado para mostrarse en cocina
import Image from "next/image";//Importamos las imagenes para poder verlas en el panel de cocina
import axios from "axios";// se utiliza para realizar solicitudes HTTP (por ejemplo, solicitudes GET, POST, PUT, DELETE, etc.) desde el lado del cliente
import { toast } from 'react-toastify'//Para usar las alertas toastify
import Swal from 'sweetalert2';//Importamos los sweet alert
import { formatearDinero } from '../helpers'//Para mostrar el total en Quetzales

export default function Orden({orden}) {
    const {id, nombre, descripcion, total, pedido, fecha, mesa} = orden//Declaramos los valores que queremos mostrar
    
    const completarOrden = async () => {//Funcion que usamos en el boton para actualizar el estado del pedido
        try {
                // Mostrar una alerta de confirmación con SweetAlert2
            const result = await Swal.fire({
                title: '¿Completar orden?',
                text: '¿Estás seguro de que deseas completar esta orden?',
                icon: 'question',
                showDenyButton: true,
                confirmButtonText: 'Sí, completar',
                cancelButtonText: 'Cancelar',
                denyButtonText: 'No completar'
            });

            if (result.isConfirmed) {
                // Realizar la acción para completar la orden
                const data = await axios.post(`/api/ordenes/${id}`)
                //toast.success('Orden Lista')
                Swal.fire('Orden Lista', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('La orden no ha sido completada', '', 'info')
            }
            
        } catch (error) {
            toast.error('Hubo un error')
        }
    }
    
    return (
        <div className="border p-10 space-y-5">
            <h3 className="text-2xl font-bold">Orden: {id} </h3>
            <p className="text-lg font-bold">No. {mesa.nombre}</p>
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
                                src={`/assets/img/${platillo.imagen}.jpeg`}
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
                        
                        {/* <div className="p-5 space-y-2"> 
                            <p className="text-xl font-bold text-amber-600">
                                Precio unitario: {formatearDinero(platillo.precio)}
                            </p>
                        </div> */}

                    </div>
                ))}
            </div>
            
            <p className="text-lg font-bold">Descripcion: {descripcion}</p>


            <div className="md:flex md:items-center md:justify-between my-10"> 
                {/* <p className="mt-5 font-black text-4xl text-amber-600"> 
                    Total a Pagar: {formatearDinero(total)}
                </p> */}

                <button //Boton para actualizar el estado de de los pedidos
                    className="bg-yellow-600 hover:bg-yellow-800 text-white mt-5 md:mt-0 py-3 px-10 uppercase
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
