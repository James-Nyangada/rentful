import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { propertyId, name, email, phone, viewingDate } = req.body;

    const booking = await prisma.viewingBooking.create({
      data: {
        propertyId: Number(propertyId),
        name,
        email,
        phone,
        viewingDate: new Date(viewingDate),
      },
    });

    res.status(201).json(booking);
  } catch (error: any) {
    res.status(500).json({
      message: `Error creating booking: ${error.message}`,
    });
  }
};

export const getManagerViewings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // authMiddleware adds authId to req.user
    const authId = req.user?.authId;

    if (!authId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const properties = await prisma.property.findMany({
      where: { managerUserId: authId },
      select: { id: true, name: true },
    });

    const propertyIds = properties.map((p) => p.id);

    const bookings = await prisma.viewingBooking.findMany({
      where: { propertyId: { in: propertyIds } },
      include: {
        property: {
          select: { name: true },
        },
      },
    });

    // Flatten property name into the booking object for easier frontend use
    const formattedBookings = bookings.map((booking) => ({
      ...booking,
      propertyName: booking.property.name,
    }));

    res.json(formattedBookings);
  } catch (error: any) {
    res.status(500).json({
      message: `Error fetching viewings: ${error.message}`,
    });
  }
};
