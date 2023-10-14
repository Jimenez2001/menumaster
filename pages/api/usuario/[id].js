import { PrismaClient } from "@prisma/client";

export default async function getUsuario(req, res) {
    try {
      const prisma = new PrismaClient();
  
      const { id } = req.query
  
  
      const usuario = await prisma.usuarios.findUnique({
        where: {
          id: parseInt(id), 
        },
        include: {
          rol: {
            select: {
              rol: true,
            },
          },
        },
      });
  
      if (!usuario) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }
  
      res.status(200).json(usuario);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ error: "Error al obtener el usuario" });
    }
  }