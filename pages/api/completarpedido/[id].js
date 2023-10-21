import { PrismaClient } from "@prisma/client";

export default async function completarpedido(req, res) {
  try {
    const prisma = new PrismaClient();

    const orden = await prisma.orden.findUnique({
      where: {
        id: parseInt(req.query.id),
      },
    });

    await prisma.mesas.update({
      where: {
        id: parseInt(orden.mesa_id),
      },
      data: {
        estado: false,
      },
    });

    const fechaVenta = new Date(); // Obtener la fecha y hora actual
    fechaVenta.setTime(fechaVenta.getTime() - 6 * 60 * 60 * 1000); // Ajustar la hora para la zona horaria de Guatemala
    const fechaVentaISO = fechaVenta.toISOString(); // Formatear la fecha en formato ISO-8601

    const ventaGuardada = await prisma.ventas.create({
      data: {
        noPedido: orden.id,
        nombre: orden.nombre,
        fecha: orden.fecha,
        total: orden.total,
        pedido: orden.pedido,
        fechaVenta: fechaVentaISO, // Utilizar la fecha en formato ISO-8601 y la zona horaria de Guatemala
        mesa: orden.mesa_id.toString(),
      },
    });

    const ordenEliminada = await prisma.orden.delete({
      where: {
        id: parseInt(orden.id),
      },
    });

    if (!ordenEliminada) {
      res.status(404).json({ error: "Mesa no encontrada" });
      return;
    }

    res
      .status(200)
      .json({ mensaje: "Mesa completada :)", venta: ventaGuardada });
  } catch (error) {
    console.error("Error al completar la mesa:", error);
    res.status(500).json({ error: "Error al completar la mesa" });
  }
}
