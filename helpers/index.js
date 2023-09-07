export const formatearDinero = (cantidad) => {
    return cantidad.toLocaleString("en-GT", {
        style: "currency",
        currency: "GTQ",
    }).substring(2); // Eliminar los dos carácteres "GT" que se añaden "GTQ"
}
