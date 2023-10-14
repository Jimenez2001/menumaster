import Image from "next/image";
import Head from "next/head";
import Layout from "../layout/Layout";
import Producto from "../components/Producto";
import useMenuMaster from "../hooks/useMenuMaster";
import Categoria from "@/components/Categoria";
import AdminLayout from "@/layout/AdminLayout";
import axios from "axios";// se utiliza para realizar solicitudes HTTP (por ejemplo, solicitudes GET, POST, PUT, DELETE, etc.) desde el lado del cliente


export default function Admin({nombreUsuario}) {
  return (
    <AdminLayout pagina={"Admin"}>
      <h1 className="text-4xl font-black">Panel de Administrador</h1>
      <p className="text-2xl my-10">Ingresa al panel que deseas ingresar</p>
    </AdminLayout>
  );
}
