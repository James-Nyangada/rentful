"use client";

import React, { useState } from "react";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetAgentTrackingQuery } from "@/state/api";
import {
  Users,
  Building,
  UserCheck,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  Mail,
  Phone,
  TrendingUp,
  Home,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

const statusIcons: Record<string, any> = {
  approved: CheckCircle,
  pending: Clock,
  rejected: XCircle,
};

const AgentTracking = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isFetching } = useGetAgentTrackingQuery({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    propertyType: propertyTypeFilter !== "all" ? propertyTypeFilter : undefined,
    location: locationFilter !== "all" ? locationFilter : undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const agents = data?.agents || [];
  const summary = data?.summary || {
    totalAgents: 0,
    totalProperties: 0,
    totalApproved: 0,
    totalPending: 0,
    totalRejected: 0,
    totalLandlords: 0,
    totalCaretakers: 0,
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPropertyTypeFilter("all");
    setLocationFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters =
    statusFilter !== "all" ||
    propertyTypeFilter !== "all" ||
    locationFilter !== "all" ||
    dateFrom ||
    dateTo;

  return (
    <div className="dashboard-container">
      <Header
        title="Agent Tracking"
        subtitle="Monitor agent performance, onboarding metrics, and property submissions"
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <Users className="w-5 h-5 mx-auto text-primary/60 mb-1" />
          <p className="text-2xl font-extrabold text-primary">{summary.totalAgents}</p>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
            Agents
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <Building className="w-5 h-5 mx-auto text-primary/60 mb-1" />
          <p className="text-2xl font-extrabold text-primary">{summary.totalProperties}</p>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
            Properties
          </p>
        </div>
        <div className="bg-white rounded-xl border border-emerald-100 shadow-sm p-4 text-center">
          <CheckCircle className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
          <p className="text-2xl font-extrabold text-emerald-600">{summary.totalApproved}</p>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
            Approved
          </p>
        </div>
        <div className="bg-white rounded-xl border border-amber-100 shadow-sm p-4 text-center">
          <Clock className="w-5 h-5 mx-auto text-amber-500 mb-1" />
          <p className="text-2xl font-extrabold text-amber-600">{summary.totalPending}</p>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
            Pending
          </p>
        </div>
        <div className="bg-white rounded-xl border border-red-100 shadow-sm p-4 text-center">
          <XCircle className="w-5 h-5 mx-auto text-red-500 mb-1" />
          <p className="text-2xl font-extrabold text-red-600">{summary.totalRejected}</p>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
            Rejected
          </p>
        </div>
        <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-4 text-center">
          <User className="w-5 h-5 mx-auto text-blue-500 mb-1" />
          <p className="text-2xl font-extrabold text-blue-600">{summary.totalLandlords}</p>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
            Landlords
          </p>
        </div>
        <div className="bg-white rounded-xl border border-violet-100 shadow-sm p-4 text-center">
          <UserCheck className="w-5 h-5 mx-auto text-violet-500 mb-1" />
          <p className="text-2xl font-extrabold text-violet-600">{summary.totalCaretakers}</p>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
            Caretakers
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search by agent name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>

          {/* Toggle Filters */}
          <Button
            variant="outline"
            className={`flex items-center gap-2 ${hasActiveFilters ? "border-primary text-primary" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                !
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              className="text-foreground/50 hover:text-red-500"
              onClick={clearFilters}
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Expandable Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1.5 block">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1.5 block">
                Property Type
              </label>
              <select
                value={propertyTypeFilter}
                onChange={(e) => setPropertyTypeFilter(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Cottage">Cottage</option>
                <option value="Rooms">Rooms</option>
                <option value="Tinyhouse">Tinyhouse</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1.5 block">
                Location
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Areas</option>
                <option value="Lavington">Lavington</option>
                <option value="Westlands">Westlands</option>
                <option value="Kileleshwa">Kileleshwa</option>
                <option value="Kilimani">Kilimani</option>
                <option value="Karen">Karen</option>
                <option value="Riverside">Riverside</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1.5 block">
                Date From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1.5 block">
                Date To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )}
      </div>

      {/* Agent List */}
      {isLoading ? (
        <Loading />
      ) : agents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
            <Users className="w-10 h-10 text-foreground/20" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">No Agents Found</h3>
          <p className="text-foreground/50 max-w-md mx-auto">
            {hasActiveFilters || search
              ? "No agents match your current search and filter criteria. Try adjusting your filters."
              : "No agent submissions have been recorded yet. Properties submitted via the \"List With Us\" form will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {agents.map((agent: any) => {
            const isExpanded = expandedAgent === agent.agentIdentifier;
            const approvalRate =
              agent.propertiesCount > 0
                ? Math.round((agent.approvedCount / agent.propertiesCount) * 100)
                : 0;

            return (
              <div
                key={agent.agentIdentifier}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                {/* Agent Summary Row */}
                <button
                  onClick={() =>
                    setExpandedAgent(isExpanded ? null : agent.agentIdentifier)
                  }
                  className="w-full px-6 py-5 flex flex-col lg:flex-row lg:items-center gap-4 text-left"
                >
                  {/* Agent Identity */}
                  <div className="flex items-center gap-4 lg:w-[280px] lg:min-w-[280px]">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {agent.agentName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-primary text-base truncate">
                        {agent.agentName}
                      </h3>
                      <p className="text-xs text-foreground/50 truncate">
                        {agent.agentEmail}
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex-1 grid grid-cols-3 md:grid-cols-6 gap-3">
                    <div className="text-center">
                      <p className="text-lg font-extrabold text-primary">
                        {agent.propertiesCount}
                      </p>
                      <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
                        Properties
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-extrabold text-emerald-600">
                        {agent.approvedCount}
                      </p>
                      <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
                        Approved
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-extrabold text-amber-600">
                        {agent.pendingCount}
                      </p>
                      <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
                        Pending
                      </p>
                    </div>
                    <div className="text-center hidden md:block">
                      <p className="text-lg font-extrabold text-red-600">
                        {agent.rejectedCount}
                      </p>
                      <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
                        Rejected
                      </p>
                    </div>
                    <div className="text-center hidden md:block">
                      <p className="text-lg font-extrabold text-blue-600">
                        {agent.landlordsOnboarded}
                      </p>
                      <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
                        Landlords
                      </p>
                    </div>
                    <div className="text-center hidden md:block">
                      <p className="text-lg font-extrabold text-violet-600">
                        {agent.caretakersOnboarded}
                      </p>
                      <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
                        Caretakers
                      </p>
                    </div>
                  </div>

                  {/* Approval Rate + Expand */}
                  <div className="flex items-center gap-4 lg:w-[160px] lg:min-w-[160px] lg:justify-end">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${approvalRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-foreground/60 min-w-[35px]">
                        {approvalRate}%
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-foreground/30" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-foreground/30" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/50">
                    {/* Agent Contact Bar */}
                    <div className="px-6 py-4 bg-primary/[0.02] border-b border-gray-100 flex flex-wrap gap-6">
                      <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <Mail className="w-4 h-4" />
                        <a
                          href={`mailto:${agent.agentEmail}`}
                          className="text-blue-600 hover:underline"
                        >
                          {agent.agentEmail}
                        </a>
                      </div>
                      {agent.agentPhone && (
                        <div className="flex items-center gap-2 text-sm text-foreground/60">
                          <Phone className="w-4 h-4" />
                          <span>{agent.agentPhone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <Calendar className="w-4 h-4" />
                        <span>
                          First submission:{" "}
                          {format(new Date(agent.firstSubmission), "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <TrendingUp className="w-4 h-4" />
                        <span>
                          Latest:{" "}
                          {format(new Date(agent.lastSubmission), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>

                    {/* Properties Table */}
                    <div className="px-6 py-4">
                      <h4 className="font-bold text-primary text-sm uppercase tracking-wider mb-3">
                        Submitted Properties ({agent.properties.length})
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2.5 px-3 font-bold text-foreground/50 uppercase tracking-wider text-xs">
                                Property
                              </th>
                              <th className="text-left py-2.5 px-3 font-bold text-foreground/50 uppercase tracking-wider text-xs">
                                Type
                              </th>
                              <th className="text-left py-2.5 px-3 font-bold text-foreground/50 uppercase tracking-wider text-xs">
                                Location
                              </th>
                              <th className="text-left py-2.5 px-3 font-bold text-foreground/50 uppercase tracking-wider text-xs">
                                Price/mo
                              </th>
                              <th className="text-left py-2.5 px-3 font-bold text-foreground/50 uppercase tracking-wider text-xs">
                                Date
                              </th>
                              <th className="text-left py-2.5 px-3 font-bold text-foreground/50 uppercase tracking-wider text-xs">
                                Landlord
                              </th>
                              <th className="text-left py-2.5 px-3 font-bold text-foreground/50 uppercase tracking-wider text-xs">
                                Caretaker
                              </th>
                              <th className="text-left py-2.5 px-3 font-bold text-foreground/50 uppercase tracking-wider text-xs">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {agent.properties.map((prop: any) => {
                              const StatusIcon =
                                statusIcons[prop.status] || Clock;
                              return (
                                <tr
                                  key={prop.id}
                                  className="border-b border-gray-100 last:border-0 hover:bg-white transition-colors"
                                >
                                  <td className="py-3 px-3">
                                    <div className="flex items-center gap-2">
                                      <Home className="w-4 h-4 text-primary/40" />
                                      <span className="font-medium text-primary">
                                        {prop.name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-3 text-foreground/60">
                                    {prop.propertyType}
                                  </td>
                                  <td className="py-3 px-3">
                                    {prop.location ? (
                                      <div className="flex items-center gap-1 text-foreground/60">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{prop.location.state}</span>
                                      </div>
                                    ) : (
                                      <span className="text-foreground/30">—</span>
                                    )}
                                  </td>
                                  <td className="py-3 px-3 font-semibold text-primary">
                                    KES{" "}
                                    {Number(prop.pricePerMonth).toLocaleString()}
                                  </td>
                                  <td className="py-3 px-3 text-foreground/60">
                                    {format(
                                      new Date(prop.postedDate),
                                      "MMM d, yyyy"
                                    )}
                                  </td>
                                  <td className="py-3 px-3 text-foreground/60">
                                    {prop.landlord ? (
                                      <span title={prop.landlord.email}>
                                        {prop.landlord.name}
                                      </span>
                                    ) : (
                                      <span className="text-foreground/30">—</span>
                                    )}
                                  </td>
                                  <td className="py-3 px-3 text-foreground/60">
                                    {prop.caretaker ? (
                                      <span title={prop.caretaker.email}>
                                        {prop.caretaker.name}
                                      </span>
                                    ) : (
                                      <span className="text-foreground/30">—</span>
                                    )}
                                  </td>
                                  <td className="py-3 px-3">
                                    <span
                                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                        statusColors[prop.status] || ""
                                      }`}
                                    >
                                      <StatusIcon className="w-3 h-3" />
                                      {prop.status.charAt(0).toUpperCase() +
                                        prop.status.slice(1)}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AgentTracking;
