import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";
import { Location } from "@prisma/client";
import { uploadToCloudinary } from "../lib/cloudinary";
import axios from "axios";
import slugify from "slugify";
import crypto from "crypto";

const prisma = new PrismaClient();

async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = slugify(name, { lower: true, strict: true });
  const uniqueSuffix = crypto.randomBytes(3).toString("hex");
  const slug = `${baseSlug}-${uniqueSuffix}`;
  // Check if slug already exists (extremely unlikely with random suffix)
  const existing = await prisma.property.findUnique({ where: { slug } });
  if (existing) {
    return generateUniqueSlug(name); // Retry
  }
  return slug;
}

export const getProperties = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      favoriteIds,
      priceMin,
      priceMax,
      beds,
      baths,
      propertyType,
      squareFeetMin,
      squareFeetMax,
      amenities,
      availableFrom,
      isSale,
      latitude,
      longitude,
    } = req.query;

    let whereConditions: Prisma.Sql[] = [];

    if (isSale !== undefined) {
      whereConditions.push(Prisma.sql`p."isSale" = ${isSale === "true"}`);
    }

    if (favoriteIds) {
      const favoriteIdsArray = (favoriteIds as string).split(",").map(Number);
      whereConditions.push(
        Prisma.sql`p.id IN (${Prisma.join(favoriteIdsArray)})`
      );
    }

    if (priceMin) {
      whereConditions.push(
        Prisma.sql`p."pricePerMonth" >= ${Number(priceMin)}`
      );
    }

    if (priceMax) {
      whereConditions.push(
        Prisma.sql`p."pricePerMonth" <= ${Number(priceMax)}`
      );
    }

    if (beds && beds !== "any") {
      whereConditions.push(Prisma.sql`p.beds >= ${Number(beds)}`);
    }

    if (baths && baths !== "any") {
      whereConditions.push(Prisma.sql`p.baths >= ${Number(baths)}`);
    }

    if (squareFeetMin) {
      whereConditions.push(
        Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`
      );
    }

    if (squareFeetMax) {
      whereConditions.push(
        Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`
      );
    }

    if (propertyType && propertyType !== "any") {
      whereConditions.push(
        Prisma.sql`p."propertyType" = ${propertyType}::"PropertyType"`
      );
    }

    if (amenities && amenities !== "any") {
      const amenitiesArray = (amenities as string).split(",");
      whereConditions.push(Prisma.sql`p.amenities @> ${amenitiesArray}`);
    }

    if (availableFrom && availableFrom !== "any") {
      const availableFromDate =
        typeof availableFrom === "string" ? availableFrom : null;
      if (availableFromDate) {
        const date = new Date(availableFromDate);
        if (!isNaN(date.getTime())) {
          whereConditions.push(
            Prisma.sql`EXISTS (
              SELECT 1 FROM "Lease" l 
              WHERE l."propertyId" = p.id 
              AND l."startDate" <= ${date.toISOString()}
            )`
          );
        }
      }
    }

    if (latitude && longitude) {
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      const radiusInKilometers = 1000;
      const degrees = radiusInKilometers / 111; // Converts kilometers to degrees

      whereConditions.push(
        Prisma.sql`ST_DWithin(
          l.coordinates::geometry,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
          ${degrees}
        )`
      );
    }

    const completeQuery = Prisma.sql`
      SELECT 
        p.*,
        json_build_object(
          'id', l.id,
          'address', l.address,
          'city', l.city,
          'state', l.state,
          'country', l.country,
          'postalCode', l."postalCode",
          'coordinates', json_build_object(
            'longitude', ST_X(l."coordinates"::geometry),
            'latitude', ST_Y(l."coordinates"::geometry)
          )
        ) as location
      FROM "Property" p
      JOIN "Location" l ON p."locationId" = l.id
      ${
        whereConditions.length > 0
          ? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`
          : Prisma.empty
      }
    `;

    const properties = await prisma.$queryRaw(completeQuery);

    res.json(properties);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving properties: ${error.message}` });
  }
};

export const getRecentProperties = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 6;

    const completeQuery = Prisma.sql`
      SELECT 
        p.*,
        json_build_object(
          'id', l.id,
          'address', l.address,
          'city', l.city,
          'state', l.state,
          'country', l.country,
          'postalCode', l."postalCode",
          'coordinates', json_build_object(
            'longitude', ST_X(l."coordinates"::geometry),
            'latitude', ST_Y(l."coordinates"::geometry)
          )
        ) as location
      FROM "Property" p
      JOIN "Location" l ON p."locationId" = l.id
      ORDER BY p."postedDate" DESC
      LIMIT ${limit}
    `;

    const properties = await prisma.$queryRaw(completeQuery);

    res.json(properties);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving recent properties: ${error.message}` });
  }
};

export const getPropertyLocations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const locations: any[] = await prisma.$queryRaw`
      SELECT 
        l.state as city,
        COUNT(p.id)::int as "propertyCount",
        (
          SELECT p2."photoUrls"[1]
          FROM "Property" p2
          JOIN "Location" l2 ON p2."locationId" = l2.id
          WHERE l2.state = l.state AND array_length(p2."photoUrls", 1) > 0
          ORDER BY p2."postedDate" DESC
          LIMIT 1
        ) as "coverImage"
      FROM "Property" p
      JOIN "Location" l ON p."locationId" = l.id
      GROUP BY l.state
      ORDER BY COUNT(p.id) DESC
    `;

    res.json(locations);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving property locations: ${error.message}` });
  }
};

export const getProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);

    const property = await prisma.property.findFirst({
      where: isNumeric ? { id: Number(id) } : { slug: id },
      include: {
        location: true,
        manager: true,
      },
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    const coordinates: { coordinates: string }[] =
      await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

    const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
    const longitude = geoJSON.coordinates[0];
    const latitude = geoJSON.coordinates[1];

    const propertyWithCoordinates = {
      ...property,
      location: {
        ...property.location,
        coordinates: {
          longitude,
          latitude,
        },
      },
    };
    res.json(propertyWithCoordinates);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error retrieving property: ${err.message}` });
  }
};

export const createProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const {
      address,
      city,
      state,
      country,
      postalCode,
      managerUserId,
      latitude: reqLat,
      longitude: reqLng,
      ...propertyData
    } = req.body;

    // Upload photos to Cloudinary
    const photoUrls = await Promise.all(
      files.map(async (file) => {
        const result = await uploadToCloudinary(
          file.buffer,
          "properties"
        );
        return result.secure_url;
      })
    );

    let finalLongitude = 36.8219;
    let finalLatitude = -1.2921;

    if (reqLat && reqLng && !isNaN(parseFloat(reqLat)) && !isNaN(parseFloat(reqLng))) {
      finalLatitude = parseFloat(reqLat);
      finalLongitude = parseFloat(reqLng);
    } else {
      const geocodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
        {
          street: address,
          city,
          country,
          postalcode: postalCode,
          format: "json",
          limit: "1",
        }
      ).toString()}`;
      try {
        const geocodingResponse = await axios.get(geocodingUrl, {
          headers: {
            "User-Agent": "RealEstateApp (justsomedummyemail@gmail.com)",
          },
        });
        if (geocodingResponse.data[0]?.lon && geocodingResponse.data[0]?.lat) {
          finalLongitude = parseFloat(geocodingResponse.data[0].lon);
          finalLatitude = parseFloat(geocodingResponse.data[0].lat);
        }
      } catch (error) {
        console.error("Geocoding failed", error);
      }
    }

    // create location
    const [location] = await prisma.$queryRaw<Location[]>`
      INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
      VALUES (${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${finalLongitude}, ${finalLatitude}), 4326))
      RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates;
    `;

    // Generate unique slug from property name
    const slug = await generateUniqueSlug(propertyData.name);

    // create property
    const newProperty = await prisma.property.create({
      data: {
        ...propertyData,
        slug,
        photoUrls,
        locationId: location.id,
        managerUserId,
        amenities:
          typeof propertyData.amenities === "string"
            ? propertyData.amenities.split(",")
            : [],
        highlights:
          typeof propertyData.highlights === "string"
            ? propertyData.highlights.split(",")
            : [],
        isPetsAllowed: propertyData.isPetsAllowed === "true",
        isParkingIncluded: propertyData.isParkingIncluded === "true",
        isSale: propertyData.isSale === "true",
        pricePerMonth: parseFloat(propertyData.pricePerMonth),
        securityDeposit: parseFloat(propertyData.securityDeposit),
        applicationFee: parseFloat(propertyData.applicationFee),
        beds: parseInt(propertyData.beds),
        baths: parseFloat(propertyData.baths),
        squareFeet: parseInt(propertyData.squareFeet),
      },
      include: {
        location: true,
        manager: true,
      },
    });

    res.status(201).json(newProperty);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error creating property: ${err.message}` });
  }
};

export const updateProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];
    const {
      address,
      city,
      state,
      country,
      postalCode,
      managerUserId,
      latitude: reqLat,
      longitude: reqLng,
      ...propertyData
    } = req.body;

    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: { location: true },
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    if (property.managerUserId !== req.user?.id) {
      res.status(403).json({ message: "Not authorized to edit this property" });
      return;
    }

    // Upload new photos to Cloudinary if provided
    let photoUrls = property.photoUrls;
    if (files && files.length > 0) {
      photoUrls = await Promise.all(
        files.map(async (file) => {
          const result = await uploadToCloudinary(file.buffer, "properties");
          return result.secure_url;
        })
      );
    }

    let finalLongitude = 36.8219;
    let finalLatitude = -1.2921;

    if (reqLat && reqLng && !isNaN(parseFloat(reqLat)) && !isNaN(parseFloat(reqLng))) {
      finalLatitude = parseFloat(reqLat);
      finalLongitude = parseFloat(reqLng);
    } else {
      const geocodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
        {
          street: address,
          city,
          country,
          postalcode: postalCode,
          format: "json",
          limit: "1",
        }
      ).toString()}`;
      try {
        const geocodingResponse = await axios.get(geocodingUrl, {
          headers: {
            "User-Agent": "RealEstateApp (justsomedummyemail@gmail.com)",
          },
        });
        if (geocodingResponse.data[0]?.lon && geocodingResponse.data[0]?.lat) {
          finalLongitude = parseFloat(geocodingResponse.data[0].lon);
          finalLatitude = parseFloat(geocodingResponse.data[0].lat);
        }
      } catch (error) {
        console.error("Geocoding failed", error);
      }
    }

    // Update location
    await prisma.$queryRaw`
      UPDATE "Location"
      SET address = ${address}, city = ${city}, state = ${state}, country = ${country}, "postalCode" = ${postalCode}, coordinates = ST_SetSRID(ST_MakePoint(${finalLongitude}, ${finalLatitude}), 4326)
      WHERE id = ${property.locationId};
    `;

    // Update property
    const updatedProperty = await prisma.property.update({
      where: { id: Number(id) },
      data: {
        ...propertyData,
        photoUrls,
        amenities:
          typeof propertyData.amenities === "string"
            ? propertyData.amenities.split(",")
            : [],
        highlights:
          typeof propertyData.highlights === "string"
            ? propertyData.highlights.split(",")
            : [],
        isPetsAllowed: propertyData.isPetsAllowed ? propertyData.isPetsAllowed === "true" : undefined,
        isParkingIncluded: propertyData.isParkingIncluded ? propertyData.isParkingIncluded === "true" : undefined,
        isSale: propertyData.isSale ? propertyData.isSale === "true" : undefined,
        pricePerMonth: propertyData.pricePerMonth ? parseFloat(propertyData.pricePerMonth) : undefined,
        securityDeposit: parseFloat(propertyData.securityDeposit),
        applicationFee: parseFloat(propertyData.applicationFee),
        beds: parseInt(propertyData.beds),
        baths: parseFloat(propertyData.baths),
        squareFeet: parseInt(propertyData.squareFeet),
      },
      include: {
        location: true,
        manager: true,
      },
    });

    res.json(updatedProperty);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error updating property: ${err.message}` });
  }
};

export const getPropertyLeases = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const leases = await prisma.lease.findMany({
      where: { propertyId: Number(id) },
      include: {
        tenant: true,
      },
    });
    res.json(leases);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error retrieving property leases: ${err.message}` });
  }
};

export const getPropertyPayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const payments = await prisma.payment.findMany({
      where: {
        lease: {
          propertyId: Number(id),
        },
      },
      include: {
        lease: true,
      },
    });
    res.json(payments);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error retrieving property payments: ${err.message}` });
  }
};

export const getAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const availabilities = await prisma.viewingAvailability.findMany({
      where: { propertyId: Number(id) },
      select: { date: true },
    });

    const dates = availabilities.map((a: { date: Date }) => a.date);
    res.json(dates);
  } catch (err: any) {
    res.status(500).json({
      message: `Error retrieving availability: ${err.message}`,
    });
  }
};

export const setAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { dates } = req.body; // Expecting an array of date strings

    if (!Array.isArray(dates)) {
      res.status(400).json({ message: "Dates must be an array" });
      return;
    }

    // First delete all existing availabilities for this property
    await prisma.viewingAvailability.deleteMany({
      where: { propertyId: Number(id) },
    });

    // Then insert the new ones
    if (dates.length > 0) {
      await prisma.viewingAvailability.createMany({
        data: dates.map((dateStr: string) => ({
          propertyId: Number(id),
          date: new Date(dateStr),
        })),
      });
    }

    res.json({ message: "Availability updated successfully" });
  } catch (err: any) {
    res.status(500).json({
      message: `Error setting availability: ${err.message}`,
    });
  }
};
