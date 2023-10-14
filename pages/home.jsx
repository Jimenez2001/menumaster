import Image from "next/image";
import Head from "next/head";
import Layout from "../layout/Layout";
import Producto from "../components/Producto";
import useMenuMaster from "../hooks/useMenuMaster";
import Categoria from "@/components/Categoria";


export default function Home() {
  const { categoriaActual } = useMenuMaster();

  return (
    <Layout pagina={`Menú ${categoriaActual?.nombre}`}>
        <>
          <h1 className="text-4xl font-black">{categoriaActual?.nombre}</h1>
          <p className="text-2xl my-10">Elige los productos para el pedido</p>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {categoriaActual?.productos?.map((producto) => (
              <Producto key={producto.id} producto={producto} />
            ))}
          </div>
        </>
    </Layout>
  );
}
