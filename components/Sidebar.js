import Image from "next/image";
import useMenuMaster from "../hooks/useMenuMaster";
import Categoria from "./Categoria";

const Sidebar = () => {
    const { categorias } = useMenuMaster();

  return (
    <>
      <Image 
          width={300} 
           height={100} 
          src='/assets/img/logomilo.jpeg' 
          alt="imagen logotipo"
      />

      <nav className="mt-10">
        {categorias.map(categoria => (
            <Categoria key={categoria.id} categoria={categoria} />
         ))}
       </nav>    
    </>
  )
}

export default Sidebar