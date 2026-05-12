import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getFeatures = async (req: Request, res: Response): Promise<void> => {
  try {
    const amenities = await prisma.customAmenity.findMany({ orderBy: { name: 'asc' } });
    const highlights = await prisma.customHighlight.findMany({ orderBy: { name: 'asc' } });
    
    res.json({ amenities, highlights });
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving features: ${error.message}` });
  }
};

export const addAmenity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "Name is required" });
      return;
    }
    const amenity = await prisma.customAmenity.create({
      data: { name },
    });
    res.status(201).json(amenity);
  } catch (error: any) {
    res.status(500).json({ message: `Error adding amenity: ${error.message}` });
  }
};

export const removeAmenity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.customAmenity.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Amenity deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: `Error removing amenity: ${error.message}` });
  }
};

export const addHighlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "Name is required" });
      return;
    }
    const highlight = await prisma.customHighlight.create({
      data: { name },
    });
    res.status(201).json(highlight);
  } catch (error: any) {
    res.status(500).json({ message: `Error adding highlight: ${error.message}` });
  }
};

export const removeHighlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.customHighlight.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Highlight deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: `Error removing highlight: ${error.message}` });
  }
};
