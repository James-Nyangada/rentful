import { cleanParams, withToast } from "@/lib/utils";
import {
  Application,
  Lease,
  Payment,
  Property,
  User,
} from "@/types/prismaTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FiltersState } from ".";

export interface Feature {
  id: number;
  name: string;
}

export interface FeaturesResponse {
  amenities: Feature[];
  highlights: Feature[];
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002",
    prepareHeaders: async (headers) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: [
    "Managers",
    "Tenants",
    "Properties",
    "PropertyDetails",
    "Leases",
    "Payments",
    "Applications",
    "Viewings",
    "PendingProperties",
    "Feature",
  ],
  endpoints: (build) => ({
    getAuthUser: build.query<AuthUserType, void>({
      queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
          const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;

          if (!token || !storedUser) {
            return { error: { status: 401, data: "Not authenticated" } };
          }

          let parsedUser;
          try {
            parsedUser = JSON.parse(storedUser);
          } catch (e) {
            return { error: { status: 401, data: "Invalid user session" } };
          }

          const userRole = parsedUser.role;
          const userAuthId = parsedUser.authId;

          if (!userAuthId) {
            return { error: { status: 401, data: "Invalid user session" } };
          }

          const endpoint =
            userRole === "manager"
              ? `/managers/${userAuthId}`
              : `/tenants/${userAuthId}`;

          const userDetailsResponse = await fetchWithBQ(endpoint);

          if (userDetailsResponse.error) {
            return { error: userDetailsResponse.error };
          }

          return {
            data: {
              userInfo: userDetailsResponse.data as User,
              userRole,
            },
          };
        } catch (error: any) {
          return { error: error.message || "Could not fetch user data" };
        }
      },
    }),

    // property related endpoints
    getProperties: build.query<
      Property[],
      Partial<FiltersState> & { favoriteIds?: number[] }
    >({
      query: (filters) => {
        const params = cleanParams({
          location: filters.location,
          priceMin: filters.priceRange?.[0],
          priceMax: filters.priceRange?.[1],
          beds: filters.beds,
          baths: filters.baths,
          propertyType: filters.propertyType,
          squareFeetMin: filters.squareFeet?.[0],
          squareFeetMax: filters.squareFeet?.[1],
          amenities: filters.amenities?.join(","),
          availableFrom: filters.availableFrom,
          isSale: filters.isSale,
          favoriteIds: filters.favoriteIds?.join(","),
          latitude: filters.coordinates?.[1],
          longitude: filters.coordinates?.[0],
        });

        return { url: "properties", params };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Properties" as const, id })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch properties.",
        });
      },
    }),

    getRecentProperties: build.query<Property[], number | void>({
      query: (limit = 6) => `properties/recent?limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Properties" as const, id })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch recent properties.",
        });
      },
    }),

    getPropertyLocations: build.query<
      { city: string; propertyCount: number; coverImage: string | null }[],
      void
    >({
      query: () => `properties/locations`,
      providesTags: [{ type: "Properties", id: "LOCATIONS" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch neighborhoods.",
        });
      },
    }),

    getProperty: build.query<Property, number | string>({
      query: (idOrSlug) => `properties/${idOrSlug}`,
      providesTags: (result, error, idOrSlug) => [{ type: "PropertyDetails", id: idOrSlug }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to load property details.",
        });
      },
    }),

    // tenant related endpoints
    getTenant: build.query<User, string>({
      query: (authId) => `tenants/${authId}`,
      providesTags: (result) => [{ type: "Tenants", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to load tenant profile.",
        });
      },
    }),

    getCurrentResidences: build.query<Property[], string>({
      query: (authId) => `tenants/${authId}/current-residences`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Properties" as const, id })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch current residences.",
        });
      },
    }),

    updateTenantSettings: build.mutation<
      User,
      { authId: string } & Partial<User>
    >({
      query: ({ authId, ...updatedTenant }) => ({
        url: `tenants/${authId}`,
        method: "PUT",
        body: updatedTenant,
      }),
      invalidatesTags: (result) => [{ type: "Tenants", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Settings updated successfully!",
          error: "Failed to update settings.",
        });
      },
    }),

    addFavoriteProperty: build.mutation<
      User,
      { authId: string; propertyId: number }
    >({
      query: ({ authId, propertyId }) => ({
        url: `tenants/${authId}/favorites/${propertyId}`,
        method: "POST",
      }),
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?.id },
        { type: "Properties", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Added to favorites!!",
          error: "Failed to add to favorites",
        });
      },
    }),

    removeFavoriteProperty: build.mutation<
      User,
      { authId: string; propertyId: number }
    >({
      query: ({ authId, propertyId }) => ({
        url: `tenants/${authId}/favorites/${propertyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?.id },
        { type: "Properties", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Removed from favorites!",
          error: "Failed to remove from favorites.",
        });
      },
    }),

    // manager related endpoints
    getManagerProperties: build.query<Property[], string>({
      query: (authId) => `managers/${authId}/properties`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Properties" as const, id })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to load manager profile.",
        });
      },
    }),

    updateManagerSettings: build.mutation<
      User,
      { authId: string } & Partial<User>
    >({
      query: ({ authId, ...updatedManager }) => ({
        url: `managers/${authId}`,
        method: "PUT",
        body: updatedManager,
      }),
      invalidatesTags: (result) => [{ type: "Managers", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Settings updated successfully!",
          error: "Failed to update settings.",
        });
      },
    }),

    createProperty: build.mutation<Property, FormData>({
      query: (newProperty) => ({
        url: `properties`,
        method: "POST",
        body: newProperty,
      }),
      invalidatesTags: (result) => [
        { type: "Properties", id: "LIST" },
        { type: "Managers", id: result?.manager?.id },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Property created successfully!",
          error: "Failed to create property.",
        });
      },
    }),

    updateProperty: build.mutation<
      Property,
      { id: number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `properties/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Properties", id: "LIST" },
        { type: "PropertyDetails", id },
        { type: "Managers", id: result?.manager?.id },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Property updated successfully!",
          error: "Failed to update property.",
        });
      },
    }),

    deleteProperty: build.mutation<void, number>({
      query: (id) => ({
        url: `properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Properties", id: "LIST" },
        { type: "PropertyDetails", id },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Property deleted successfully!",
          error: "Failed to delete property.",
        });
      },
    }),

    // lease related enpoints
    getLeases: build.query<Lease[], number>({
      query: () => "leases",
      providesTags: ["Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch leases.",
        });
      },
    }),

    getPropertyLeases: build.query<Lease[], number>({
      query: (propertyId) => `properties/${propertyId}/leases`,
      providesTags: ["Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch property leases.",
        });
      },
    }),

    getPayments: build.query<Payment[], number>({
      query: (leaseId) => `leases/${leaseId}/payments`,
      providesTags: ["Payments"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch payment info.",
        });
      },
    }),

    getPropertyPayments: build.query<Payment[], number>({
      query: (propertyId) => `properties/${propertyId}/payments`,
      providesTags: ["Payments"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch property payments.",
        });
      },
    }),

    // application related endpoints
    getApplications: build.query<
      Application[],
      { userId?: string; userType?: string }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.userId) {
          queryParams.append("userId", params.userId.toString());
        }
        if (params.userType) {
          queryParams.append("userType", params.userType);
        }

        return `applications?${queryParams.toString()}`;
      },
      providesTags: ["Applications"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch applications.",
        });
      },
    }),

    updateApplicationStatus: build.mutation<
      Application & { lease?: Lease },
      { id: number; status: string }
    >({
      query: ({ id, status }) => ({
        url: `applications/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Applications", "Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Application status updated successfully!",
          error: "Failed to update application settings.",
        });
      },
    }),

    createApplication: build.mutation<Application, Partial<Application>>({
      query: (body) => ({
        url: `applications`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Applications"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Application created successfully!",
          error: "Failed to create applications.",
        });
      },
    }),

    // viewing related endpoints
    getAvailability: build.query<string[], number>({
      query: (propertyId) => `properties/${propertyId}/availability`,
      providesTags: ["Viewings"],
    }),

    setAvailability: build.mutation<
      void,
      { propertyId: number; dates: string[] }
    >({
      query: ({ propertyId, dates }) => ({
        url: `viewings/${propertyId}/availability`,
        method: "POST",
        body: { dates },
      }),
      invalidatesTags: ["Viewings"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Availability updated successfully!",
          error: "Failed to update availability.",
        });
      },
    }),

    createBooking: build.mutation<void, any>({
      query: (bookingData) => ({
        url: `viewings/book`,
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["Viewings"],
    }),

    getManagerViewings: build.query<any[], void>({
      query: () => `viewings`,
      providesTags: ["Viewings"],
    }),

    // Features related endpoints
    getFeatures: build.query<FeaturesResponse, void>({
      query: () => "features",
      providesTags: ["Feature"],
    }),
    addAmenity: build.mutation<Feature, { name: string }>({
      query: (body) => ({
        url: "features/amenity",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Feature"],
    }),
    removeAmenity: build.mutation<void, number>({
      query: (id) => ({
        url: `features/amenity/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Feature"],
    }),
    addHighlight: build.mutation<Feature, { name: string }>({
      query: (body) => ({
        url: "features/highlight",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Feature"],
    }),
    removeHighlight: build.mutation<void, number>({
      query: (id) => ({
        url: `features/highlight/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Feature"],
    }),

    // Agent workflow endpoints
    agentSubmitProperty: build.mutation<{ message: string; propertyId: number }, FormData>({
      query: (formData) => ({
        url: `properties/agent-submit`,
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Property submitted successfully! It will be reviewed by our team.",
          error: "Failed to submit property.",
        });
      },
    }),

    getPendingProperties: build.query<Property[], void>({
      query: () => `properties/pending`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "PendingProperties" as const, id })),
              { type: "PendingProperties", id: "LIST" },
            ]
          : [{ type: "PendingProperties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch pending properties.",
        });
      },
    }),

    approveProperty: build.mutation<{ message: string; property: Property }, number>({
      query: (id) => ({
        url: `properties/${id}/approve`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "PendingProperties", id: "LIST" },
        { type: "Properties", id: "LIST" },
        { type: "PropertyDetails", id },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Property approved and is now live!",
          error: "Failed to approve property.",
        });
      },
    }),

    rejectProperty: build.mutation<{ message: string; property: Property }, number>({
      query: (id) => ({
        url: `properties/${id}/reject`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "PendingProperties", id: "LIST" },
        { type: "PropertyDetails", id },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Property has been rejected.",
          error: "Failed to reject property.",
        });
      },
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
  useUpdateManagerSettingsMutation,
  useGetPropertiesQuery,
  useGetRecentPropertiesQuery,
  useGetPropertyLocationsQuery,
  useGetPropertyQuery,
  useGetCurrentResidencesQuery,
  useGetManagerPropertiesQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetTenantQuery,
  useAddFavoritePropertyMutation,
  useRemoveFavoritePropertyMutation,
  useGetLeasesQuery,
  useGetPropertyLeasesQuery,
  useGetPaymentsQuery,
  useGetPropertyPaymentsQuery,
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useCreateApplicationMutation,
  useGetAvailabilityQuery,
  useSetAvailabilityMutation,
  useCreateBookingMutation,
  useGetManagerViewingsQuery,
  useGetFeaturesQuery,
  useAddAmenityMutation,
  useRemoveAmenityMutation,
  useAddHighlightMutation,
  useRemoveHighlightMutation,
  useAgentSubmitPropertyMutation,
  useGetPendingPropertiesQuery,
  useApprovePropertyMutation,
  useRejectPropertyMutation,
} = api;
