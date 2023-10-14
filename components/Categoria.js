import Image from "next/image";
import useMenuMaster from "../hooks/useMenuMaster";

const Categoria = ({categoria}) => {
    const { categoriaActual, handleClickCategoria } = useMenuMaster();//Extraer de Provider.jsx la funcion hacer click a categoria

    const {nombre, icono, id} = categoria;
    return (
        <div 
            className={`${
            categoriaActual?.id === id ? 'bg-amber-400' : ''
            } flex items-center gap-4 w-full border p-5 hover:bg-amber-400`}>
           
            <Image
                width={70}
                height={70}
                src={`/assets/img/icono_${icono}.png`}
                alt="Imagen Icono"
            />

            <button
                type="button"
                className="text-2xl font-bold hover:cursor-pointer" 
                onClick={() => handleClickCategoria(id)}>
                {nombre}
            </button>
        </div>
    );
};

export default Categoria;