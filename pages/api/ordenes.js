import { PrismaClient } from '@prisma/client'//Para poder insertar en la base de datos

export default async function handler(req, res){
    const prisma = new PrismaClient()
    
    //Obtener Ordenes
    const ordenes = await prisma.orden.findMany({
        where: {//Aqui solo traemos nada más los pedidos con estado false de la tabla orden
            estado: false
        }
    })
    res.status(200).json(ordenes);
    
    //Crear Ordenes
    if(req.method === 'POST'){
        const orden = await prisma.orden.create({
            data: {//Con esto mandamos la información a la base de datos
                nombre: req.body.nombre,
                total: req.body.total,
                pedido: req.body.pedido,
                fecha: req.body.fecha,
            },
        });

        res.status(200).json(orden);
    }
}