import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";
import { Location } from "@prisma/client";
import { uploadToCloudinary } from "../lib/cloudinary";
import { applyWatermark } from "../lib/watermark";
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
      location,
      latitude,
      longitude,
    } = req.query;

    let whereConditions: Prisma.Sql[] = [
      Prisma.sql`p."status" = 'approved'`
    ];

    if (location && location !== "any") {
      whereConditions.push(
        Prisma.sql`(l.city ILIKE ${`%${location}%`} OR l.state ILIKE ${`%${location}%`})`
      );
    }

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
      WHERE p."status" = 'approved'
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
          WHERE l2.state = l.state AND array_length(p2."photoUrls", 1) > 0 AND p2."status" = 'approved'
          ORDER BY p2."postedDate" DESC
          LIMIT 1
        ) as "coverImage"
      FROM "Property" p
      JOIN "Location" l ON p."locationId" = l.id
      WHERE p."status" = 'approved'
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

    // Apply watermark and upload photos to Cloudinary
    const photoUrls = await Promise.all(
      files.map(async (file) => {
        const watermarkedBuffer = await applyWatermark(file.buffer);
        const result = await uploadToCloudinary(
          watermarkedBuffer,
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

    // create property - Manager submissions are immediately approved
    const newProperty = await prisma.property.create({
      data: {
        name: propertyData.name,
        description: propertyData.description,
        propertyType: propertyData.propertyType,
        slug,
        photoUrls,
        status: "approved",
        locationId: location.id,
        managerUserId,
        amenities:
          typeof propertyData.amenities === "string"
            ? propertyData.amenities.split(",").filter((a: string) => a.trim() !== "")
            : Array.isArray(propertyData.amenities) ? propertyData.amenities : [],
        highlights:
          typeof propertyData.highlights === "string"
            ? propertyData.highlights.split(",").filter((h: string) => h.trim() !== "")
            : Array.isArray(propertyData.highlights) ? propertyData.highlights : [],
        isPetsAllowed: propertyData.isPetsAllowed === "true" || propertyData.isPetsAllowed === true,
        isParkingIncluded: propertyData.isParkingIncluded === "true" || propertyData.isParkingIncluded === true,
        isSale: propertyData.isSale === "true" || propertyData.isSale === true,
        isRent: propertyData.isRent === "true" || propertyData.isRent === true,
        pricePerMonth: parseFloat(propertyData.pricePerMonth) || 0,
        securityDeposit: parseFloat(propertyData.securityDeposit) || 0,
        applicationFee: parseFloat(propertyData.applicationFee) || 0,
        beds: parseInt(propertyData.beds) || 0,
        baths: parseFloat(propertyData.baths) || 0,
        squareFeet: parseInt(propertyData.squareFeet) || 0,
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

    // Upload new photos to Cloudinary if provided (with watermark)
    let photoUrls = property.photoUrls;
    if (files && files.length > 0) {
      photoUrls = await Promise.all(
        files.map(async (file) => {
          const watermarkedBuffer = await applyWatermark(file.buffer);
          const result = await uploadToCloudinary(watermarkedBuffer, "properties");
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
        name: propertyData.name,
        description: propertyData.description,
        propertyType: propertyData.propertyType,
        photoUrls,
        amenities:
          typeof propertyData.amenities === "string"
            ? propertyData.amenities.split(",").filter((a: string) => a.trim() !== "")
            : Array.isArray(propertyData.amenities) ? propertyData.amenities : undefined,
        highlights:
          typeof propertyData.highlights === "string"
            ? propertyData.highlights.split(",").filter((h: string) => h.trim() !== "")
            : Array.isArray(propertyData.highlights) ? propertyData.highlights : undefined,
        isPetsAllowed: propertyData.isPetsAllowed !== undefined ? (propertyData.isPetsAllowed === "true" || propertyData.isPetsAllowed === true) : undefined,
        isParkingIncluded: propertyData.isParkingIncluded !== undefined ? (propertyData.isParkingIncluded === "true" || propertyData.isParkingIncluded === true) : undefined,
        isSale: propertyData.isSale !== undefined ? (propertyData.isSale === "true" || propertyData.isSale === true) : undefined,
        isRent: propertyData.isRent !== undefined ? (propertyData.isRent === "true" || propertyData.isRent === true) : undefined,
        pricePerMonth: propertyData.pricePerMonth ? parseFloat(propertyData.pricePerMonth) : undefined,
        securityDeposit: propertyData.securityDeposit ? parseFloat(propertyData.securityDeposit) : undefined,
        applicationFee: propertyData.applicationFee ? parseFloat(propertyData.applicationFee) : undefined,
        beds: propertyData.beds ? parseInt(propertyData.beds) : undefined,
        baths: propertyData.baths ? parseFloat(propertyData.baths) : undefined,
        squareFeet: propertyData.squareFeet ? parseInt(propertyData.squareFeet) : undefined,
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

export const deleteProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    if (property.managerUserId !== req.user?.id) {
      res
        .status(403)
        .json({ message: "Not authorized to delete this property" });
      return;
    }

    await prisma.property.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Property deleted successfully" });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error deleting property: ${err.message}` });
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

// ==========================================
// AGENT WORKFLOW ENDPOINTS
// ==========================================

/**
 * Agent submission endpoint - no auth required.
 * Status is hardcoded to 'pending'. Agent cannot override.
 */
export const agentSubmitProperty = async (
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
      agentName,
      agentEmail,
      agentPhone,
      availableDays,
      landlordName,
      landlordEmail,
      landlordPhone,
      caretakerName,
      caretakerEmail,
      caretakerPhone,
      agentAuthId, // Link to authenticated agent if available
      latitude: reqLat,
      longitude: reqLng,
      ...propertyData
    } = req.body;

    if (!agentName || !agentEmail) {
      res.status(400).json({ message: "Agent name and email are required" });
      return;
    }

    if (!files || files.length === 0) {
      res.status(400).json({ message: "At least one property photo is required" });
      return;
    }

    // Handle Landlord (optional)
    let landlordId = undefined;
    if (landlordEmail) {
      const landlord = await prisma.landlord.upsert({
        where: { email: landlordEmail },
        update: {
          name: landlordName || undefined,
          phoneNumber: landlordPhone || undefined,
        },
        create: {
          name: landlordName || "Unknown",
          email: landlordEmail,
          phoneNumber: landlordPhone || null,
          onboardedById: agentAuthId || null,
        },
      });
      landlordId = landlord.id;
    }

    // Handle Caretaker (optional)
    let caretakerId = undefined;
    if (caretakerEmail) {
      const caretaker = await prisma.caretaker.upsert({
        where: { email: caretakerEmail },
        update: {
          name: caretakerName || undefined,
          phoneNumber: caretakerPhone || undefined,
        },
        create: {
          name: caretakerName || "Unknown",
          email: caretakerEmail,
          phoneNumber: caretakerPhone || null,
          onboardedById: agentAuthId || null,
        },
      });
      caretakerId = caretaker.id;
    }

    // Apply watermark and upload photos to Cloudinary (pending folder)
    const photoUrls = await Promise.all(
      files.map(async (file) => {
        const watermarkedBuffer = await applyWatermark(file.buffer);
        const result = await uploadToCloudinary(
          watermarkedBuffer,
          "properties/pending"
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

    const slug = await generateUniqueSlug(propertyData.name);

    // Find the first manager to assign the property to
    const manager = await prisma.user.findFirst({
      where: { role: "manager" },
    });

    if (!manager) {
      res.status(500).json({ message: "No manager found in the system. Please contact support." });
      return;
    }

    // Create property - ALWAYS pending for agent submissions
    const submittedBy = `${agentName} | ${agentEmail}${agentPhone ? ` | ${agentPhone}` : ""}`;

    const newProperty = await prisma.property.create({
      data: {
        name: propertyData.name,
        description: propertyData.description,
        propertyType: propertyData.propertyType,
        slug,
        photoUrls,
        status: "pending",
        submittedBy,
        locationId: location.id,
        managerUserId: manager.authId,
        landlordId,
        caretakerId,
        onboardedByAgentId: agentAuthId || null,
        amenities:
          typeof propertyData.amenities === "string"
            ? propertyData.amenities.split(",").filter((a: string) => a.trim() !== "")
            : Array.isArray(propertyData.amenities) ? propertyData.amenities : [],
        highlights:
          typeof propertyData.highlights === "string"
            ? propertyData.highlights.split(",").filter((h: string) => h.trim() !== "")
            : Array.isArray(propertyData.highlights) ? propertyData.highlights : [],
        isPetsAllowed: propertyData.isPetsAllowed === "true" || propertyData.isPetsAllowed === true,
        isParkingIncluded: propertyData.isParkingIncluded === "true" || propertyData.isParkingIncluded === true,
        isSale: propertyData.isSale === "true" || propertyData.isSale === true,
        isRent: propertyData.isRent === "true" || propertyData.isRent === true,
        pricePerMonth: parseFloat(propertyData.pricePerMonth) || 0,
        securityDeposit: parseFloat(propertyData.securityDeposit) || 0,
        applicationFee: parseFloat(propertyData.applicationFee) || 0,
        beds: parseInt(propertyData.beds) || 0,
        baths: parseFloat(propertyData.baths) || 0,
        squareFeet: parseInt(propertyData.squareFeet) || 0,
      },
      include: {
        location: true,
      },
    });


    // Generate viewing availabilities for the next 60 days if availableDays is provided
    if (availableDays && typeof availableDays === "string" && availableDays.trim() !== "") {
      const daysArray = availableDays.split(",").filter(d => d.trim() !== "").map(Number);
      if (daysArray.length > 0) {
        const availabilities = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start at midnight
        
        // Generate for the next 60 days
        for (let i = 0; i < 60; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          
          if (daysArray.includes(date.getDay())) {
            availabilities.push({
              propertyId: newProperty.id,
              date: date,
            });
          }
        }
        
        if (availabilities.length > 0) {
          await prisma.viewingAvailability.createMany({
            data: availabilities,
          });
        }
      }
    }

    res.status(201).json({
      message: "Property submitted successfully! It will be reviewed by our team.",
      propertyId: newProperty.id,
    });
  } catch (err: any) {
    console.error("Agent submission error:", err);
    res
      .status(500)
      .json({ message: `Error submitting property: ${err.message}` });
  }
};

/**
 * Get all pending properties for manager review.
 * Manager only.
 */
export const getPendingProperties = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
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
      WHERE p."status" = 'pending'
      ORDER BY p."postedDate" DESC
    `;

    const properties = await prisma.$queryRaw(completeQuery);

    res.json(properties);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving pending properties: ${error.message}` });
  }
};

/**
 * Approve a property listing.
 * Manager only. Toggles status to 'approved'.
 */
export const approveProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    const updatedProperty = await prisma.property.update({
      where: { id: Number(id) },
      data: { status: "approved" },
      include: {
        location: true,
      },
    });

    res.json({
      message: "Property approved and is now live!",
      property: updatedProperty,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error approving property: ${err.message}` });
  }
};

/**
 * Reject a property listing.
 * Manager only. Toggles status to 'rejected'.
 */
export const rejectProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    const updatedProperty = await prisma.property.update({
      where: { id: Number(id) },
      data: { status: "rejected" },
      include: {
        location: true,
      },
    });

    res.json({
      message: "Property has been rejected.",
      property: updatedProperty,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error rejecting property: ${err.message}` });
  }
};
