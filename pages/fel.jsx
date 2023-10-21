import React from "react";
import Image from "next/image";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function fel() {
  const token = getCookie("_token");
  const [loading, setLoading] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState({});
  const router = useRouter(); //Aqui declaramos la variable router

  //PARA OBTENER EN PANTALLA EL USUARIO LOGUEADO
  const getIdUsuario = async () => {
    try {
      const url = "http://localhost:3000/api/decodeToken";
      const response = await axios.post(url, { token });
      await getUsuario(response.data.userId);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsuario = async (id) => {
    try {
      console.log("La queso", id);
      const url = `http://localhost:3000/api/usuario/${id}`;
      const response = await axios.get(url);
      console.log(response.data);
      setUsuarioActual(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getIdUsuario();
  }, []);

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

  const handleSubmit = async () => {
    try {
      const url =
        "https://certificador.feel.com.gt/fel/procesounificado/transaccion/v2/xml";

      const datosXML = `
      <dte:GTDocumento xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:dte="http://www.sat.gob.gt/dte/fel/0.2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="0.1" xsi:schemaLocation="http://www.sat.gob.gt/dte/fel/0.2.0">
      <dte:SAT ClaseDocumento="dte">
        <dte:DTE ID="DatosCertificados">
          <dte:DatosEmision ID="DatosEmision">
            <dte:DatosGenerales CodigoMoneda="GTQ" FechaHoraEmision="2023-10-19T09:58:00-06:00" Tipo="FACT"></dte:DatosGenerales>
            <dte:Emisor AfiliacionIVA="GEN" CodigoEstablecimiento="1" CorreoEmisor="parrilladadonmilo@gmail.com" NITEmisor="13494600" NombreComercial="Parrillada Don Milo" NombreEmisor="Karla Melitza Castellanos Aldana">
              <dte:DireccionEmisor>
                <dte:Direccion>4a Ave 4-50 zona 1</dte:Direccion>
                <dte:CodigoPostal>17012</dte:CodigoPostal>
                <dte:Municipio>POPTUN</dte:Municipio>
                <dte:Departamento>PETEN</dte:Departamento>
                <dte:Pais>GT</dte:Pais>
              </dte:DireccionEmisor>
            </dte:Emisor>
            <dte:Receptor CorreoReceptor="" IDReceptor="76365204" NombreReceptor="Nombre de Prueba">
              <dte:DireccionReceptor>
                <dte:Direccion>CUIDAD</dte:Direccion>
                <dte:CodigoPostal>01001</dte:CodigoPostal>
                <dte:Municipio>GUATEMALA</dte:Municipio>
                <dte:Departamento>GUATEMALA</dte:Departamento>
                <dte:Pais>GT</dte:Pais>
              </dte:DireccionReceptor>
            </dte:Receptor>
            <dte:Frases>
              <dte:Frase CodigoEscenario="1" TipoFrase="1"></dte:Frase>
            </dte:Frases>
            <dte:Items>
              <dte:Item BienOServicio="B" NumeroLinea="1">
                <dte:Cantidad>1.00</dte:Cantidad>
                <dte:UnidadMedida>UND</dte:UnidadMedida>
                <dte:Descripcion>PRODUCTO5</dte:Descripcion>
                <dte:PrecioUnitario>100.00</dte:PrecioUnitario>
                <dte:Precio>100.00</dte:Precio>
                <dte:Descuento>0.00</dte:Descuento>
                <dte:Impuestos>
                  <dte:Impuesto>
                    <dte:NombreCorto>IVA</dte:NombreCorto>
                    <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                    <dte:MontoGravable>89.29</dte:MontoGravable>
                    <dte:MontoImpuesto>10.71</dte:MontoImpuesto>
                  </dte:Impuesto>
                </dte:Impuestos>
                <dte:Total>100.00</dte:Total>
              </dte:Item>
            </dte:Items>
            <dte:Totales>
              <dte:TotalImpuestos>
                <dte:TotalImpuesto NombreCorto="IVA" TotalMontoImpuesto="10.71"></dte:TotalImpuesto>
              </dte:TotalImpuestos>
              <dte:GranTotal>100.00</dte:GranTotal>
            </dte:Totales>
          </dte:DatosEmision>
        </dte:DTE>
        <dte:Adenda>
          <Codigo_cliente>C01</Codigo_cliente>
          <Observaciones>ESTA ES UNA ADENDA</Observaciones>
        </dte:Adenda>
      </dte:SAT>
    </dte:GTDocumento>
        `;


      const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'UsuarioFirma': '13494600',
            'LlaveFirma': '28b6722a17fd3d79cf9f127026533c17',
            'UsuarioApi': '13494600',
            'LlaveApi': '1A931CAEEC7D47E5D3C5787C9DEA5CD5',
            'identificador': 'PRUEBA3',
          }
      }


      const response = await axios.post(url, datosXML, config);

      console.log(response);
      console.log("Funciona puta:", response.data);
    } catch (error) {
      if (error.response) {
        // La solicitud fue hecha y el servidor respondió con un código de estado diferente de 2xx
        console.error('Respuesta del servidor con código de error:', error.response.data);
      } else if (error.request) {
        // La solicitud fue hecha, pero no se recibió ninguna respuesta
        console.error('No se recibió respuesta del servidor:', error.request);
      } else {
        // Algo sucedió en la configuración de la solicitud que provocó un error
        console.error('Error al configurar la solicitud:', error.message);
      }
    }
  };

  return (
    <>
      {loading ? ( //Para mostrar el spinner por si quieren entrar al sistema sin logearse
        <div className="flex flex-col justify-center items-center min-h-screen bg-yellow-400">
          <div className="spinner">
            <div className="dot1"></div>
            <div className="dot2"></div>
          </div>
          <p className="font-bold uppercase text-white">Redirigiendo.....</p>
        </div>
      ) : (
        <div className="bg-blue-500">
          <div className="flex flex-col items-center justify-center min-h-screen">
            <Image
              width={150}
              height={150}
              src="/assets/img/fel1.png"
              alt="imagen logotipo"
            />
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-center text-sky-500">
                Ingresa datos para la Factura
              </h2>

              <button
                onClick={handleSubmit}
                className="w-full gap-x-4 cursor-pointer
          px-5 py-2 mt-5 font-bold uppercase rounded"
              >
                Prueba
              </button>

            </div>
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
      )}
    </>
  );
}
