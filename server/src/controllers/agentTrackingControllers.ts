import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get all agents who have submitted properties, with their metrics.
 * Supports filters: search, status, propertyType, location (state), dateFrom, dateTo
 */
export const getAgentTrackingData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { search, status, propertyType, location, dateFrom, dateTo } = req.query;

    // Build the where clause for properties that were submitted by agents
    const propertyWhere: any = {
      submittedBy: { not: null },
    };

    if (status && status !== "all") {
      propertyWhere.status = status as string;
    }

    if (propertyType && propertyType !== "all") {
      propertyWhere.propertyType = propertyType as string;
    }

    if (location && location !== "all") {
      propertyWhere.location = {
        state: location as string,
      };
    }

    if (dateFrom || dateTo) {
      propertyWhere.postedDate = {};
      if (dateFrom) {
        propertyWhere.postedDate.gte = new Date(dateFrom as string);
      }
      if (dateTo) {
        propertyWhere.postedDate.lte = new Date(dateTo as string);
      }
    }

    // Get all agent-submitted properties matching filters
    const properties = await prisma.property.findMany({
      where: propertyWhere,
      include: {
        location: true,
        landlord: true,
        caretaker: true,
      },
      orderBy: { postedDate: "desc" },
    });

    // Group properties by agent (using the submittedBy field)
    const agentMap = new Map<string, {
      agentIdentifier: string;
      agentName: string;
      agentEmail: string;
      agentPhone: string;
      properties: any[];
      propertiesCount: number;
      approvedCount: number;
      pendingCount: number;
      rejectedCount: number;
      landlordsOnboarded: Set<string>;
      caretakersOnboarded: Set<string>;
      firstSubmission: Date;
      lastSubmission: Date;
    }>();

    for (const prop of properties) {
      if (!prop.submittedBy) continue;

      // Parse agent info from "Name | Email | Phone" format
      const parts = prop.submittedBy.split(" | ");
      const agentName = parts[0]?.trim() || "Unknown";
      const agentEmail = parts[1]?.trim() || "Unknown";
      const agentPhone = parts[2]?.trim() || "";
      const agentIdentifier = agentEmail.toLowerCase();

      if (!agentMap.has(agentIdentifier)) {
        agentMap.set(agentIdentifier, {
          agentIdentifier,
          agentName,
          agentEmail,
          agentPhone,
          properties: [],
          propertiesCount: 0,
          approvedCount: 0,
          pendingCount: 0,
          rejectedCount: 0,
          landlordsOnboarded: new Set(),
          caretakersOnboarded: new Set(),
          firstSubmission: prop.postedDate,
          lastSubmission: prop.postedDate,
        });
      }

      const agent = agentMap.get(agentIdentifier)!;
      agent.properties.push({
        id: prop.id,
        name: prop.name,
        status: prop.status,
        propertyType: prop.propertyType,
        pricePerMonth: prop.pricePerMonth,
        postedDate: prop.postedDate,
        location: prop.location
          ? {
              address: prop.location.address,
              city: prop.location.city,
              state: prop.location.state,
            }
          : null,
        landlord: prop.landlord
          ? { name: prop.landlord.name, email: prop.landlord.email }
          : null,
        caretaker: prop.caretaker
          ? { name: prop.caretaker.name, email: prop.caretaker.email }
          : null,
      });

      agent.propertiesCount++;

      if (prop.status === "approved") agent.approvedCount++;
      else if (prop.status === "pending") agent.pendingCount++;
      else if (prop.status === "rejected") agent.rejectedCount++;

      if (prop.landlord) {
        agent.landlordsOnboarded.add(prop.landlord.email);
      }
      if (prop.caretaker) {
        agent.caretakersOnboarded.add(prop.caretaker.email);
      }

      if (prop.postedDate < agent.firstSubmission) {
        agent.firstSubmission = prop.postedDate;
      }
      if (prop.postedDate > agent.lastSubmission) {
        agent.lastSubmission = prop.postedDate;
      }
    }

    // Convert map to array and apply search filter
    let agents = Array.from(agentMap.values()).map((agent) => ({
      agentIdentifier: agent.agentIdentifier,
      agentName: agent.agentName,
      agentEmail: agent.agentEmail,
      agentPhone: agent.agentPhone,
      propertiesCount: agent.propertiesCount,
      approvedCount: agent.approvedCount,
      pendingCount: agent.pendingCount,
      rejectedCount: agent.rejectedCount,
      landlordsOnboarded: agent.landlordsOnboarded.size,
      caretakersOnboarded: agent.caretakersOnboarded.size,
      firstSubmission: agent.firstSubmission,
      lastSubmission: agent.lastSubmission,
      properties: agent.properties,
    }));

    // Apply text search filter
    if (search) {
      const searchLower = (search as string).toLowerCase();
      agents = agents.filter(
        (a) =>
          a.agentName.toLowerCase().includes(searchLower) ||
          a.agentEmail.toLowerCase().includes(searchLower) ||
          a.agentPhone.includes(searchLower)
      );
    }

    // Sort by properties count descending (most active first)
    agents.sort((a, b) => b.propertiesCount - a.propertiesCount);

    // Summary stats
    const summary = {
      totalAgents: agents.length,
      totalProperties: agents.reduce((sum, a) => sum + a.propertiesCount, 0),
      totalApproved: agents.reduce((sum, a) => sum + a.approvedCount, 0),
      totalPending: agents.reduce((sum, a) => sum + a.pendingCount, 0),
      totalRejected: agents.reduce((sum, a) => sum + a.rejectedCount, 0),
      totalLandlords: agents.reduce((sum, a) => sum + a.landlordsOnboarded, 0),
      totalCaretakers: agents.reduce((sum, a) => sum + a.caretakersOnboarded, 0),
    };

    res.json({ agents, summary });
  } catch (error: any) {
    res.status(500).json({
      message: `Error retrieving agent tracking data: ${error.message}`,
    });
  }
};
