import { z } from 'zod';

export const StadiumZoneSchema = z.object({
  id: z.number(),
  name: z.string(),
  capacity: z.number(),
  current_occupancy: z.number(),
});
export type StadiumZone = z.infer<typeof StadiumZoneSchema>;

export const IncidentSchema = z.object({
  id: z.number(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']),
  zone_id: z.number(),
  created_at: z.string().datetime(),
});
export type Incident = z.infer<typeof IncidentSchema>;

export const RecommendationSchema = z.object({
  id: z.number(),
  incident_id: z.number(),
  ai_confidence: z.number(),
  proposed_action: z.string(),
  approved: z.boolean(),
});
export type Recommendation = z.infer<typeof RecommendationSchema>;

export const AlertSchema = z.object({
  id: z.number(),
  message: z.string(),
  priority: z.enum(['INFO', 'WARNING', 'CRITICAL']),
  zone_id: z.number(),
});
export type Alert = z.infer<typeof AlertSchema>;

export const TimelineEntrySchema = z.object({
  id: z.number(),
  incident_id: z.number(),
  description: z.string(),
  timestamp: z.string().datetime(),
});
export type TimelineEntry = z.infer<typeof TimelineEntrySchema>;
