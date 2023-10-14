import { useState, useEffect } from "react";
import Image from "next/image";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usuarioActual, setUsuarioActual] = useState({});

  const getIdUsuario = async (token) => {
    try {
      const url = "http://localhost:3000/api/decodeToken";
      const response = await axios.post(url, { token });
      getUsuario(response.data.userId);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsuario = async (id) => {
    try {
      const url = `http://localhost:3000/api/usuario/${id}`;
      const response = await axios.get(url);
      console.log(response.data);
      setUsuarioActual(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = "http://localhost:3000/api/login";

      const usuario = { email: email.trim(), password: password.trim() };

      if (usuario.email === "" || usuario.password === "") {
        alert("Todos los campos son obligatorios");
        return;
      }

      const response = await axios.post(url, usuario);

      const token = response.data.token;

      // Guardar el token en las cookies
      setCookie("_token", token, {
        maxAge: 28800, // Duración de la cookie en segundos
        path: "/", // Ruta de acceso de la cookie
      });

      await getIdUsuario(token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (usuarioActual?.rol?.rol === "administrador") {
      router.push("/admin");
      console.log("Administrador Logeado correctamente");
      return;
    }

    if (usuarioActual?.rol?.rol === "mesero") {
      router.push("/home");
      console.log("Mesero Logeado correctamente");
      return;
    }

    if (usuarioActual?.rol?.rol === "cocinero") {
      router.push("/cocina");
      console.log("Cocinero Logeado correctamente");
      return;
    }

    if (usuarioActual?.rol?.rol === "cajero") {
      router.push("/caja");
      console.log("Cajero Logeado correctamente");
      return;
    }
  }, [usuarioActual]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        width={300}
        height={100}
        src="/assets/img/logomilo.jpeg"
        alt="imagen logotipo"
      />
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-amber-500">Inicio de Sesión</h2>

        <form action="post" onSubmit={handleSubmit}>
          <div className="mt-5">
            <input
              type="text"
              placeholder="Email"
              className="w-full px-4 py-3 mb-3 bg-gray-100 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-3 mb-3 bg-gray-100 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="w-full bg-yellow-600 hover:bg-yellow-800 text-white py-3 px-10 uppercase font-bold rounded-lg"
              type="submit"
              value="Iniciar Sesión"
            />
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
  );
}
