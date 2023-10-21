import { PrismaClient } from "@prisma/client";

export default async function eliminarOrden(req, res) {
  try {
    const prisma = new PrismaClient();

    const { id } = req.query;

    const orden = await prisma.orden.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!orden) {
      res.status(404).json({ error: "Mesa no encontrada" });
      return;
    }

     await prisma.mesas.update({
      where: {
        id: parseInt(orden.mesa_id),
      },
      data: {
        estado: false,
      },
    });

     await prisma.orden.delete({
      where: {
        id: orden.id,
      },
    });

    res.status(200).json({ mensaje: "Orden eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la orden:", error);
    res.status(500).json({ error: "Error al eliminar la orden" });
  }
}
