import Head from "next/head";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router"; //libreria para que navegue entre componentes
import { useState, useEffect } from "react";
import { deleteCookie } from "cookies-next";
import axios from "axios";

const opcionesMenu = [
  //url de cada vista
  { paso: 1, nombre: "Ventas", url: "/venta" },
  { paso: 2, nombre: "Registro", url: "/registro" },
  { paso: 3, nombre: "Mesero", url: "/home" },
  { paso: 4, nombre: "Cocina", url: "/cocina" },
  { paso: 5, nombre: "Caja", url: "/caja" },
];

export default function AdminLayout({ children, pagina }) {
  const router = useRouter(); //Aqui declaramos la variable router
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
            <title>Parrillada - {pagina}</title>
            <meta name="description" content="MenuMaster Parrillada" />
          </Head>

          <div className="md:flex">
            <div className="md:w-4/12 xl:w-1/4 2xl:w-1/5 py-5">
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
              <div>
                <ul className="text-2xl font-bold hover:cursor-pointer">
                  {opcionesMenu.map((opcion) => (
                    <li
                      key={opcion.paso}
                      className="flex items-center gap-4 w-full border p-5 hover:bg-amber-400"
                    >
                      <button
                        onClick={() => {
                          // Para que al darle click nos lleve a la url
                          router.push(opcion.url);
                        }}
                        className="text-2xl font-bold hover:text-yellow-500 cursor-pointer block "
                      >
                        {opcion.nombre}
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleLogout}
                  className="w-full gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-red-500 hover:bg-red-400
          px-5 py-2 mt-5 font-bold uppercase rounded"
                >
                  <span className="font-black">Cerrar Sesión</span>
                </button>
              </div>
            </div>

            <main className="mt-10">{children}</main>
          </div>

          <ToastContainer />
          <footer //Opcionalllllllllllllllllllllllllllllllllllllllllllllllllllll
            className="bg-gray-800 text-white py-4"
          >
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
