import axios from "axios";
import { useEffect, useState } from "react";
import CajaLayout from "@/layout/CajaLayout";
import Modal from "../components/Modal";
import Image from "next/image"; //Importamos las imagenes para poder verlas en el panel de cocina
import { toast } from "react-toastify"; //Para usar las alertas toastify
import Swal from "sweetalert2"; //Importamos los sweet alert
import eliminarOrden from "./api/ordenes/delete/[id]";
import { router } from "next/router";

// 1
import { getCookie } from "cookies-next";

export default function caja() {
  const [mesas, setMesas] = useState([]);
  const [ordenes, setOrdenes] = useState([]); //Enviamos ordenes
  const [showModal, setShowModal] = useState(false); //Para abrir y cerrar modal

  // 2
  const [usuarioActual, setUsuarioActual] = useState({});

  // 3
  const token = getCookie("_token");

  // 4
  const getIdUsuario = async () => {
    try {
      const url = "http://localhost:3000/api/decodeToken";
      const response = await axios.post(url, { token });
      getUsuario(response.data.userId);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsuario = async (id) => {
    try {
      const url = `http://localhost:3000/api/usuario/${id}`;
      const response = await axios.get(url);
      console.log("perro usuario", response.data);
      setUsuarioActual(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // PARA OBTENER LAS MESAS EXISTENTES
  const getMesas = async () => {
    try {
      const url = "http://localhost:3000/api/mesas/mesas";
      const { data } = await axios(url);
      setMesas(data);
    } catch (error) {
      console.log(error);
    }
  };

  //PARA MOSTRAR LA INFORMACIÓN DE LA ORDEN DE LA MESA SELECCIONADA
  const getOrdenes = async (id) => {
    try {
      const url = `http://localhost:3000/api/ordenes/mesas/${id}`;
      const { data } = await axios(url);
      console.log(data);
      setOrdenes(data);
    } catch (error) {
      console.log(error);
    }
  };

  //LA FUNCION QUE LUEGO DE CREAR EL PRODUCTO NOS MANDA AL LINK DEL PRODUCTO PARA PAGAR
  const handlePagarOrden = async () => {
    try {
      await createProducto(ordenes[0]?.total);
    } catch (error) {
      console.log(error);
    }
  };

  //FUNCION QUE CREA EL PRODUCTO EN RECURRENTE ENVIANDO EL TOTAL DEL PEDIDO DE LA MESA
  const createProducto = async (total) => {
    try {
      const url = "https://app.recurrente.com/api/products";

      const producto = {
        product: {
          name: "Pago Comida",
          description: "Por consumo de alimentos",
          cancel_url: "http://localhost:3000/caja",
          success_url: "http://localhost:3000/caja",
          custom_payment_method_settings: "true",
          card_payments_enabled: "true",
          bank_transfer_payments_enabled: "true",
          available_installments: [],
          prices_attributes: [
            {
              amount_as_decimal: `${total}`,
              currency: "GTQ",
              charge_type: "one_time",
            },
          ],
        },
      };

      const response = await axios.post(url, producto, {
        headers: {
          "X-PUBLIC-KEY": process.env.SECRETPUBLIC,
          "X-SECRET-KEY": process.env.SECRETKEY,
        },
      });

      await pagarOrden(response.data.id);
    } catch (error) {
      console.log(error);
    }
  };

  //AGARRA EL ID DE RECURRENTE DEL PRODUCTO QUE CREAMOS Y NOS REDIRIJE A ESE LINK
  const pagarOrden = async (id) => {
    try {
      const url = "https://app.recurrente.com/api/checkouts";

      const producto = {
        items: [{ price_id: id }],
      };

      console.log("no se xd", producto);
      const response = await axios.post(url, producto, {
        headers: {
          "X-PUBLIC-KEY": process.env.SECRETPUBLIC,
          "X-SECRET-KEY": process.env.SECRETKEY,
        },
      });

      window.open(response.data.checkout_url, "_blank");
    } catch (error) {
      console.log(error);
    }
  };

  //EJECUTA LA FUNCION GET MESAS
  useEffect(() => {
    getMesas();
    // 5
    getIdUsuario();
  }, []);

  //CAMBIA EL ESTADO DE LA MESA A FALSE PARA QUE ESTÉ DISPONIBLE DE NUEVO
  const completarMesa = async (id) => {
    //Funcion que usamos en el boton para actualizar el estado del pedido
    try {
      // Mostrar una alerta de confirmación con SweetAlert2
      const result = await Swal.fire({
        title: "¿Completar Mesa?",
        text: "¿Estás seguro de que deseas completar esta mesa?",
        icon: "question",
        showDenyButton: true,
        confirmButtonText: "Sí, completar",
        cancelButtonText: "Cancelar",
        denyButtonText: "No completar",
      });

      if (result.isConfirmed) {
        // Realizar la acción para completar la orden
        const data = await axios.post(`/api/completarpedido/${id}`);
        //toast.success('Orden Lista')
        Swal.fire("Mesa Disponible", "", "success");
        await getMesas();
        setShowModal(false);
      } else if (result.isDenied) {
        Swal.fire("La mesa aún sigue ocupada", "", "info");
      }
    } catch (error) {
      console.log(error);
      toast.error("Hubo un error");
    }
  };

  return (
    <>
      {/* 6 */}
      {usuarioActual?.rol?.rol === "cajero" ||
      usuarioActual?.rol?.rol === "administrador" ? (
        <CajaLayout pagina={"Caja"}>
          <h1 className="text-4xl font-black">Panel de Caja</h1>
          <p className="text-2xl my-10">
            Revisa las ordenes pendientes de pago
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {mesas.map((mesa) => (
              <div
                className="cursor-pointer"
                key={mesa.id}
                onClick={async () => {
                  setShowModal(true);
                  await getOrdenes(mesa.id);
                }}
              >
                {mesa.estado === false ? (
                  <>
                    <Image
                      width={300}
                      height={400}
                      alt={`Imagen producto ${mesa.nombre}`}
                      src="/assets/img/mesa_libre1.png"
                    />
                    <p className="text- font-bold uppercase text-center">
                      Disponible
                    </p>
                  </>
                ) : (
                  <>
                    <Image
                      width={300}
                      height={400}
                      alt={`Imagen producto ${mesa.nombre}`}
                      src="/assets/img/mesa_ocupada1.png"
                    />
                    <p className="font-bold uppercase text-center">Ocupada</p>
                  </>
                )}
                <p className="text-center text-xl">{mesa?.nombre}</p>
              </div>
            ))}
          </div>
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            {ordenes.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-600">
                  No hay Órdenes Asociadas a esta mesa
                </p>
              </div>
            ) : (
              <div className="p-4">
                <h3 className="text-3xl font-semibold text-amber-600">
                  Órden: {ordenes[0]?.id}
                </h3>
                <p className="text-lg font-bold text-gray-700">
                  No. Mesa {ordenes[0]?.mesa_id}
                </p>
                <p className="text-lg font-bold text-gray-700">
                  Mesero: {ordenes[0]?.nombre}
                </p>
                <p className="text-lg font-bold text-gray-700">
                  Fecha: {ordenes[0]?.fecha}
                </p>

                <div className="mt-6">
                  {ordenes[0]?.pedido?.map((pedido) => (
                    <div key={pedido.id} className="flex items-center mb-3">
                      <img
                        className="w-16 h-10 object-cover rounded-lg"
                        src={`/assets/img/${pedido.imagen}.jpeg`}
                        alt={`Imagen Platillo ${pedido.nombre}`}
                      />
                      <div className="ml-4">
                        <p className="text-lg font-bold text-amber-500">
                          {pedido?.nombre}
                        </p>
                        <p className="text-xl font-bold text-amber-600">
                          Cantidad: {pedido.cantidad}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-2xl font-semibold mt-6 text-right text-amber-600">
                  Total: Q{ordenes[0]?.total}
                </p>

                <button
                  onClick={handlePagarOrden}
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                >
                  Pago tarjeta
                </button>
                <button
                  onClick={() => router.push("/fel")}
                  type="button"
                  className="text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                >
                  Generar FEL
                </button>

                <button
                  onClick={() => completarMesa(ordenes[0].id)}
                  type="button"
                  className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                >
                  Completar Mesa
                </button>
              </div>
            )}
          </Modal>
        </CajaLayout>
      ) : (
        <div className=" bg-gray-800 flex flex-col justify-center items-center h-screen p-10">
          <p className="text-white text-center font-bold text-4xl uppercase">
            No tienes los permisos necesarios para poder visualizar este
            apartado del sistema
          </p>
          <Image
            width={300}
            height={400}
            alt={"Imagen not found"}
            src="/assets/img/error.png"
            className="mx-auto p-5"
          />
        </div>
      )}
    </>
  );
}
