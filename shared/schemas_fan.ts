import { z } from 'zod';

export const FanProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  preferred_language: z.string(),
  accessibility_required: z.boolean(),
  favorite_team: z.string().nullable(),
});
export type FanProfile = z.infer<typeof FanProfileSchema>;

export const VenuePOISchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.enum(['FOOD', 'RESTROOM', 'MEDICAL', 'MERCH', 'ENTRANCE']),
  zone_id: z.number(),
  accessibility_equipped: z.boolean(),
});
export type VenuePOI = z.infer<typeof VenuePOISchema>;

export const FanJourneyStepSchema = z.object({
  id: z.number(),
  step_name: z.enum(['ARRIVAL', 'PARKING', 'ENTRY', 'SEAT', 'FOOD', 'RESTROOM', 'MATCH', 'EXIT', 'TRANSPORT_HOME']),
  mapped_intelligence_module: z.string(),
  description: z.string(),
});
export type FanJourneyStep = z.infer<typeof FanJourneyStepSchema>;

export const FanOfflineCacheBundleSchema = z.object({
  id: z.number(),
  fan_id: z.number(),
  cached_venue_map_url: z.string().nullable(),
  cached_emergency_instructions: z.string().nullable(),
  cached_ticket_info: z.any().nullable(),
  cached_favorite_routes: z.any().nullable(),
  last_synced: z.string().datetime(),
});
export type FanOfflineCacheBundle = z.infer<typeof FanOfflineCacheBundleSchema>;
