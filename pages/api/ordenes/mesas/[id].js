import { PrismaClient } from "@prisma/client";

export default async function getOrdenMesa(req, res) {
  try {
    const prisma = new PrismaClient();

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID de mesa no proporcionado" });
    }

    const pedidos = await prisma.orden.findMany({
      where: {
        mesa_id: parseInt(id),
      },
    });

    if (!pedidos) {
      return res
        .status(400)
        .json({ error: "La mesa no tiene pedidos asociados" });
    }

    res.status(200).json(pedidos);
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
