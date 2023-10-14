import useSWR from 'swr'//Importamos swr que nos permite consultar en tiempo real la api de ordenes
import axios from 'axios'// se utiliza para realizar solicitudes HTTP (por ejemplo, solicitudes GET, POST, PUT, DELETE, etc.) desde el lado del cliente
import CocinaLayout from "../layout/CocinaLayout"
import Orden from '../components/Orden'//Para mandar a llamar el componente Orden
import CajaLayout from '@/layout/CajaLayout'
import OrdenCaja from '@/components/OrdenCaja'

export default function caja() {
    const fetcher = () => axios.get('/api/ordenes').then(datos => datos.data)//Usamos axios para hacer la consulta a la API get de la data de las ordenes
    const { data, error, isLoading } = useSWR('/api/ordenes', fetcher, {refreshInterval: 100})//Retorna los datos de la consulta, tambien algún error y también muestra contenido antes de la nueva consulta y mandamos a llamar la funcion fetcher

    /* console.log(data);
    console.log(error);
    console.log(isLoading); */

    return(
        <CajaLayout pagina={'Caja'}>
            <h1 className="text-4xl font-black">Panel de Caja</h1>
            <p className="text-2xl my-10">Revisa las ordenes pendientes de pago</p>

            {data && data.length ? data.map(orden =>//Aqui mostramos si hay ordenes
                <OrdenCaja
                    key={orden.id}
                    orden={orden}
                />
            ) : <p>No hay ordenes pendientes de pago</p> }

        </CajaLayout>
    )
}
