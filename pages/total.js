import { useEffect, useCallback } from "react";//Para guardar estados
import Layout from "../layout/Layout";
import useMenuMaster from "../hooks/useMenuMaster";
import { formatearDinero } from "../helpers";

export default function Total() {
    const { pedido, nombre, setNombre, colocarOrden, total } = useMenuMaster()//Para declarar el import useMenuMaster

    const comprobarPedido = useCallback(() => {//Cuando pedido está vacio o no tiene nada en nombre y el nombre tiene que ser mayor a 3 letras
        return pedido.length === 0 || nombre === '' || nombre.length < 3;
    }, [pedido, nombre]);

    useEffect(() => {//Para comprobar el estado del pedido
        comprobarPedido();
    }, [pedido, comprobarPedido]);

    return (
        <Layout pagina='Total y Confirmar Pedido'>
            <h1 className="text-4xl font-black">Total y Confirmar Pedido</h1>
            <p className="text-2xl my-10">Confirma tu pedido a continuación</p>

            <form
                onSubmit={colocarOrden}//Estará disponible cuando se coloque una orden
            >
                <div>
                    <label //Para mostrar titulo nombre
                        htmlFor="nombre"
                        className="block uppercase text-slate-800 font-bold
                        text-xl"
                    >
                        Nombre
                    </label>

                    <input //Para agregar el nombre del mesero
                        id="nombre"
                        type="text" 
                        className="bg-gray-200 w-full lg:w-1/3 mt-3 p-2 rounded-md"
                        value={nombre}
                        onChange={ (e) => setNombre(e.target.value) }
                    />
                </div>

                <div className="mt-10">
                    <p className="text-2xl">
                        Total a pagar: {""} <span className="font-bold">{formatearDinero(total)}</span>
                    </p>
                </div>

                <div className="mt-5">
                    <input //El boton para enviar la orden
                        type="submit"
                        className={`${
                            comprobarPedido() 
                            ? "bg-gray-400" 
                            : "bg-green-600 hover:bg-green-800"
                        } w-full lg:w-auto px-5 py-0 rounded uppercase
                        font-bold text-white text-center`}
                        value="Confirmar Pedido"
                        disabled={comprobarPedido()}//Funcion que no envia hasta que haya un pedido
                    />
                </div>
            </form>
        </Layout>
        
    )
}