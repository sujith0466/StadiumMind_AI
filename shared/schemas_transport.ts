import { z } from 'zod';

export const ParkingZoneSchema = z.object({
  id: z.number(),
  name: z.string(),
  max_capacity: z.number(),
  current_occupancy: z.number(),
  zone_type: z.enum(['VIP', 'PUBLIC', 'ADA']),
});
export type ParkingZone = z.infer<typeof ParkingZoneSchema>;

export const FanTransportRecommendationSchema = z.object({
  id: z.number(),
  fan_id: z.number().nullable(),
  parking_recommendation: z.string().nullable(),
  best_entrance: z.string().nullable(),
  shuttle_recommendation: z.string().nullable(),
  walking_route_estimation_mins: z.number().nullable(),
  accessibility_aware: z.boolean(),
  timestamp: z.string().datetime(),
});
export type FanTransportRecommendation = z.infer<typeof FanTransportRecommendationSchema>;

export const SustainabilityMetricSchema = z.object({
  id: z.number(),
  timestamp: z.string().datetime(),
  total_carbon_offset_kg: z.number(),
  renewable_energy_percentage: z.number(),
  water_usage_liters: z.number(),
  recycling_rate_percentage: z.number(),
  waste_diversion_percentage: z.number(),
  energy_cost_savings_usd: z.number(),
});
export type SustainabilityMetric = z.infer<typeof SustainabilityMetricSchema>;
