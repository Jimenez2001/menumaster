//aqui importamos las librerias que funcionen en todos los componentes
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { Pasos } from "../components/Pasos";
import Modal from "react-modal";
import { ToastContainer } from "react-toastify"; //Libreria de las alertas al agregar producto al pedido
import ModalProducto from "../components/ModalProducto";
import useMenuMaster from "../hooks/useMenuMaster";
import "react-toastify/dist/ReactToastify.css"; //Para que las alertas tengan estilos
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const customStyles = {
  //Este es el diseño del modal
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#__next");

export default function Layout({ children, pagina }) {
  const { modal } = useMenuMaster();

  const token = getCookie("_token");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      {loading ? ( //Para mostrar el spinner por si quieren entrar al sistema sin logearse
        <div className="flex flex-col justify-center items-center min-h-screen bg-yellow-400">
          <div class="spinner">
            <div class="dot1"></div>
            <div class="dot2"></div>
          </div>
          <p className="font-bold uppercase text-white">Redirigiendo.....</p>
        </div>
      ) : (
        <>
          <Head>
            <title>Menumaster - {pagina}</title>
            <meta name="description" content="Menumaster Parrillada"></meta>
          </Head>
          <div className="md:flex">
            <aside className="md:w-4/12 xl:w-1/4 2xl:w-1/5">
              <Sidebar></Sidebar>
            </aside>

            <main className="md:w-8/12 xl:w-3/4 2xl:w-4/5 h-screen overflow-y-scroll">
              <div className="p-10">
                <Pasos></Pasos>
                {children}
              </div>
            </main>
          </div>

          {modal && (
            <Modal isOpen={modal} style={customStyles}>
              <ModalProducto></ModalProducto>
            </Modal>
          )}
          <ToastContainer></ToastContainer>

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
