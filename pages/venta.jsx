import Head from "next/head";
import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { setCookie } from "cookies-next";
import useMenuMaster from "../hooks/useMenuMaster";
import { useRouter } from "next/router";
import axios from "axios"; // se utiliza para realizar solicitudes HTTP (por ejemplo, solicitudes GET, POST, PUT, DELETE, etc.) desde el lado del cliente
import Swal from "sweetalert2"; //Importamos los sweet alert
import { Router } from "next/router";
import Modal from "react-modal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "cookies-next";
import { deleteCookie } from "cookies-next";

export default function venta() {
  const router = useRouter(); //Aqui declaramos la variable router
  const [ventas, setVentas] = useState([]); //Para que liste la información de los usuarios
  const [modalIsOpen, setModalIsOpen] = useState(false); //Para abrir modal
  const [selectedUserId, setSelectedUserId] = useState(null); //Para que guarde el id al darle click en editar
  const [editedUserData, setEditedUserData] = useState({
    username: "",
    email: "",
    password: "",
    rol_id: "",
  });
  const token = getCookie("_token");
  const [loading, setLoading] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState({});

  //PARA OBTENER EN PANTALLA EL USUARIO LOGUEADO
  const getIdUsuario = async () => {
    try {
      const url = "https://bloody-carriage-production.up.railway.app/api/decodeToken";
      const response = await axios.post(url, { token });
      await getUsuario(response.data.userId);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsuario = async (id) => {
    try {
      console.log("La queso", id);
      const url = `https://bloody-carriage-production.up.railway.app/api/usuario/${id}`;
      const response = await axios.get(url);
      console.log(response.data);
      setUsuarioActual(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Función para obtener la ruta de la imagen en función del rol
  const obtenerImagenRol = () => {
    if (usuarioActual?.rol?.rol === "administrador") {
      return "/assets/img/administrador.png";
    } else if (usuarioActual?.rol?.rol === "cajero") {
      return "/assets/img/cajero.png";
    } else if (usuarioActual?.rol?.rol === "coinero") {
      return "/assets/img/cocinero.png";
    } else if (usuarioActual?.rol?.rol === "mesero") {
      return "/assets/img/mesero.png";
    } else {
      return "/assets/img/user.png";
    }
  };

  useEffect(() => {
    getIdUsuario();
  }, []);

  //PARA EL CONTROL DE SI NO ESTA LOGEADO NO PUEDE ACCEDER A LAS PAGINAS
  useEffect(() => {
    if (!token) {
      setLoading(true); // Activa el estado de carga antes de redirigir

      // Simula un tiempo de espera antes de redirigir (puedes omitir esto en tu código)
      const timeout = setTimeout(() => {
        router.push("/");
      }, 2000);

      // Limpia el timeout si el componente se desmonta antes de que termine
      return () => clearTimeout(timeout);
    }
  }, [token, router]);

  // Cerrar Sesión
  const handleLogout = () => {
    deleteCookie("_token");
    router.push("/");
  };

  useEffect(() => {
    // Realiza una solicitud GET a tu API de usuarios
    axios
      .get("/api/ventas/ventas") // Ajusta la URL de la solicitud según tu API
      .then((response) => {
        setVentas(response.data); // Almacena los datos de usuarios en el estado
      })
      .catch((error) => {
        console.error("Error al obtener las ventas:", error);
      });
  }, []);

  return (
    <>
      {loading ? ( //Para mostrar el spinner por si quieren entrar al sistema sin logearse
        <div className="flex flex-col justify-center items-center min-h-screen bg-yellow-400">
          <div className="spinner">
            <div className="dot1"></div>
            <div className="dot2"></div>
          </div>
          <p className="font-bold uppercase text-white">Redirigiendo.....</p>
        </div>
      ) : (
        <>
          <Head>
            <title>Parrillada - Venta</title>
            <meta name="description" content="MenuMaster Parrillada" />
          </Head>
          <aside className="md:w-4/12 xl:w-1/4 2xl:w-1/5 py-5">
            <Image
              width={300}
              height={100}
              src="/assets/img/logomilo.jpeg"
              alt="imagen logotipo"
              className="mx-auto"
            />
            <Image
              width={100}
              height={100}
              src={obtenerImagenRol()} // Utiliza la función para obtener la imagen
              alt="imagen rol"
              className="mx-auto"
            />
            <p className="text-lg font-bold text-center">
              Bienvenido: {usuarioActual?.username}
            </p>
            <p className="text-lg text-center">{usuarioActual?.email}</p>
            <p className="text-lg font-bold uppercase text-center">
              {usuarioActual?.rol?.rol}
            </p>
            <button
              onClick={() => router.push("/admin")}
              className="w-full gap-x-3 cursor-pointer text-white p-2 transition-colors duration-300 bg-yellow-500 hover:bg-yellow-400
          px-5 py-2 mt-5 font-bold uppercase rounded"
            >
              <span className="font-black">Regresar</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-red-500 hover:bg-red-400
          px-5 py-2 mt-5 font-bold uppercase rounded"
            >
              <span className="font-black">Cerrar Sesión</span>
            </button>
          </aside>

          <div className="flex flex-col items-center justify min-h-screen">
            <h1 className="text-4xl font-black">Ventas Registradas</h1>

            <div className="container p-10 w-full bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-amber-500">
                Información de las Ventas
              </h2>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="font-bold uppercase shadow-md w-fulls bg-yellow-50 dark:bg-amber-500 dark:text-white">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        No. Venta
                      </th>
                      <th scope="col" className="px-6 py-3">
                        No. Orden
                      </th>
                      <th scope="col" className="px-6 py-3">
                        No. Mesa
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Fecha Venta
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Productos
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventas.map((venta, index) => (
                      <tr
                        key={index}
                        className="dark:bg-amber-100 dark:border-gray-700"
                      >
                        <td className="px-6 py-4 text-black font-bold uppercase">
                          {venta.id}
                        </td>
                        <td className="px-6 py-4">{venta.noPedido}</td>
                        <td className="px-6 py-4">{venta.mesa}</td>
                        <td className="px-6 py-4 uppercase">
                          {venta.fechaVenta}
                        </td>
                        <td className="px-6 py-4">
                          {venta.pedido.map((producto, idx) => (
                            <div key={idx}>
                              {/* <div>ID: {producto.id}</div>
                              <div>Imagen: {producto.imagen}</div> */}
                              <div>{producto.nombre}</div>
                              <div>Precio: {producto.precio}</div>
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4">{venta.total}</td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
              <p>
                &copy; {new Date().getFullYear()} MenuMaster. Todos los derechos
                reservados.
              </p>
            </div>
          </footer>
        </>
      )}
    </>
  );
}
