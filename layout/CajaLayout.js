import Head from "next/head";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { deleteCookie } from "cookies-next";

export default function CajaLayout({children, pagina}) {
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
  
    // Cerrar Sesión
    const handleLogout = () => {
      deleteCookie("_token");
      router.push("/");
    };
  
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
              <title>Parrillada - {pagina}</title>
              <meta name="description" content="MenuMaster Parrillada" />
            </Head>
  
            <div className="md:flex">
              <aside className="md:w-4/12 xl:w-1/4 2xl:w-1/5 py-5">
                <Image
                  width={300}
                  height={100}
                  src="/assets/img/logomilo.jpeg"
                  alt="imagen logotipo"
                />
                <button
                  onClick={handleLogout}
                  className="w-full gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-red-500 hover:bg-red-400
            px-5 py-2 mt-5 font-bold uppercase rounded"
                >
                  <span className="font-black">Cerrar Sesión</span>
                </button>
              </aside>
  
              <main className="md:w-8/12 xl:w-3/4 2xl:w-4/5 h-screen overflow-y-scroll">
                <div className="p-10">{children}</div>
              </main>
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
