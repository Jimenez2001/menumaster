//aqui importamos las librerias que funcionen en todos los componentes
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { Pasos } from "../components/Pasos";
import Modal from "react-modal";
import { ToastContainer } from "react-toastify";//Libreria de las alertas al agregar producto al pedido
import ModalProducto from "../components/ModalProducto";
import useMenuMaster from "../hooks/useMenuMaster";
import "react-toastify/dist/ReactToastify.css";//Para que las alertas tengan estilos

const customStyles = {//Este es el diseño del modal
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

export default function Layout({children, pagina}) {

    const { modal } = useMenuMaster()

    return (
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
        className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} MenuMaster. Todos los derechos reservados.</p>
             </div>
        </footer>
        </>
    );
  }