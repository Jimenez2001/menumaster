import Image from "next/image";
import useMenuMaster from "../hooks/useMenuMaster";
import Categoria from "./Categoria";
import { deleteCookie } from "cookies-next";
import { useRouter } from 'next/router'

const Sidebar = () => {
  const { categorias } = useMenuMaster();
  const router = useRouter()


  // Cerrar Sesión
  const handleLogout = () => {
    deleteCookie("_token");
    router.push("/")
  };

  return (
    <>
      <Image
        width={300}
        height={100}
        src="/assets/img/logomilo.jpeg"
        alt="imagen logotipo"
      />

      <nav className="mt-10">
        {categorias.map((categoria) => (
          <Categoria key={categoria.id} categoria={categoria} />
        ))}
        <button
          onClick={handleLogout}
          className="w-full gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-red-500 hover:bg-red-400
          px-5 py-2 mt-5 font-bold uppercase rounded"
        >
          <span className="font-black">
            Cerrar Sesión
          </span>
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
