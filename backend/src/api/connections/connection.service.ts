import prisma from "@/utils/prismaClient";
import type { CreateConnectionData, ConnectionStatus } from "@/types/connection.types";

export const createConnection = async (connection: CreateConnectionData) => {
  return await prisma.connection.create({
    data: { 
        requesterId: connection.requesterId,
        addresseeId: connection.addresseeId,
    }
  });
};


export const getConnections = async (profileId: string) => {
    return await prisma.connection.findMany({
        where: { OR: [{ requesterId: profileId }, { addresseeId: profileId }] },
    });
};



export const acceptConnection = async (requesterId: string, addresseeId: string, status: ConnectionStatus) => {
    return await prisma.connection.update({
        where: { requesterId_addresseeId: { requesterId: requesterId, addresseeId: addresseeId } },
        data: { status: "ACCEPTED" },
    });
};

export const deleteConnection = async (requesterId: string, addresseeId: string) => {
    return await prisma.connection.delete({
        where: { requesterId_addresseeId: { requesterId: requesterId, addresseeId: addresseeId } },
    });
};


