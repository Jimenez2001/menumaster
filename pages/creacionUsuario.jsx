import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { setCookie } from "cookies-next";
import useMenuMaster from "../hooks/useMenuMaster";
import { useRouter } from "next/router";
import axios from "axios"; // se utiliza para realizar solicitudes HTTP (por ejemplo, solicitudes GET, POST, PUT, DELETE, etc.) desde el lado del cliente
import Swal from "sweetalert2"; //Importamos los sweet alert
import { Router } from "next/router";

export default function creacionUsuario() {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    rol_id,
    setRol_id,
    crearUsuario,
  } = useMenuMaster(); //Para declarar el import useMenuMaster
  const router = useRouter(); //Aqui declaramos la variable router

  return (
    <>
      <Head>
        <title>Parrillada - Registro Usuario</title>
        <meta name="description" content="MenuMaster Parrillada" />
      </Head>
      <aside className="md:w-4/12 xl:w-1/4 2xl:w-1/5 py-5">
        <Image
          width={300}
          height={100}
          src="/assets/img/logomilo.jpeg"
          alt="imagen logotipo"
        />
        <button
          onClick={() => router.push("/registro")}
          className="w-full gap-x-4 cursor-pointer text-white p-2 transition-colors duration-300 bg-yellow-500 hover:bg-yellow-400
          px-5 py-2 mt-5 font-bold uppercase rounded"
        >
          <span className="font-black">Regresar</span>
        </button>
      </aside>
      <div className="flex flex-col items-center justify min-h-screen">
        <h1 className="text-4xl font-black">Panel de Registro</h1>
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-amber-500">Creación Usuario</h2>

          <form onSubmit={crearUsuario}>
            <div className="mt-5">
              <input
                type="text"
                placeholder="Usuario"
                className="w-full px-4 py-3 mb-3 bg-amber-100 border rounded-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Email"
                className="w-full px-4 py-3 mb-3 bg-amber-100 border rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full px-4 py-3 mb-3 bg-amber-100 border rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <select
                className="w-full px-4 py-3 mb-3 bg-amber-100 border rounded-lg"
                value={rol_id}
                onChange={(e) => setRol_id(e.target.value)}
                required
              >{/* Para listar los roles del sistema */}
                <option value="" disabled selected>
                  Selecciona un rol
                </option>
                <option value="1">Administrador</option>
                <option value="2">Cajero</option>
                <option value="3">Cocinero</option>
                <option value="4">Mesero</option>
             
              </select>
              <div className="mt-5">
                <input //El boton para enviar los datos del nuevo usuario
                  type="submit"
                  className={
                    "w-full bg-yellow-600 hover:bg-yellow-800 text-white py-3 px-10 uppercase font-bold rounded-lg"
                  }
                  value="Crear Usuario"
                />
              </div>
            </div>
          </form>
        </div>
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto text-center">
            <p>
              &copy; {new Date().getFullYear()} MenuMaster. Todos los derechos
              reservados.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
