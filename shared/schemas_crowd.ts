import { z } from 'zod';

export const CrowdZoneSchema = z.object({
  id: z.number(),
  name: z.string(),
  max_capacity: z.number(),
  geo_polygon: z.any().nullable(),
});
export type CrowdZone = z.infer<typeof CrowdZoneSchema>;

export const CrowdSnapshotSchema = z.object({
  id: z.number(),
  zone_id: z.number(),
  occupancy: z.number(),
  timestamp: z.string().datetime(),
});
export type CrowdSnapshot = z.infer<typeof CrowdSnapshotSchema>;

export const QueueSchema = z.object({
  id: z.number(),
  zone_id: z.number(),
  estimated_wait_time: z.number(),
  person_count: z.number(),
});
export type Queue = z.infer<typeof QueueSchema>;

export const DensityAlertSchema = z.object({
  id: z.number(),
  zone_id: z.number(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  timestamp: z.string().datetime(),
});
export type DensityAlert = z.infer<typeof DensityAlertSchema>;

export const SafeRouteSchema = z.object({
  id: z.number(),
  start_zone: z.number(),
  end_zone: z.number(),
  waypoints: z.array(z.number()),
  is_active: z.boolean(),
});
export type SafeRoute = z.infer<typeof SafeRouteSchema>;
