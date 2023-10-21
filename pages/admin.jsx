import Image from "next/image";
import Head from "next/head";
import Layout from "../layout/Layout";
import Producto from "../components/Producto";
import useMenuMaster from "../hooks/useMenuMaster";
import Categoria from "@/components/Categoria";
import AdminLayout from "@/layout/AdminLayout";
import { useEffect, useState } from "react";
import axios from "axios";// se utiliza para realizar solicitudes HTTP (por ejemplo, solicitudes GET, POST, PUT, DELETE, etc.) desde el lado del cliente
import { getCookie } from "cookies-next";

export default function Admin() {
  const [usuarioActual, setUsuarioActual] = useState({});
  const token = getCookie("_token");

  const getIdUsuario = async () => {
    try {
      const url = "https://bloody-carriage-production.up.railway.app/api/decodeToken";
      const response = await axios.post(url, { token });
      getUsuario(response.data.userId);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsuario = async (id) => {
    try {
      const url = `https://bloody-carriage-production.up.railway.app/api/usuario/${id}`;
      const response = await axios.get(url);
      console.log("perro usuario", response.data);
      setUsuarioActual(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Obtenemos el rol de usuario para obtener el rol
    getIdUsuario();
  }, []);


  return (
    <>
    {usuarioActual?.rol?.rol === "administrador" ? (
    <AdminLayout pagina={"Admin"}>
      <h1 className="text-4xl font-black">Panel de Administrador</h1>
      <p className="text-2xl my-10">Ingresa al panel que deseas ingresar</p>
    </AdminLayout>
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
