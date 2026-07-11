import { z } from 'zod';

export const VolunteerSchema = z.object({
  id: z.number(),
  name: z.string(),
  active: z.boolean(),
  languages: z.array(z.string()).nullable(),
  medical_training: z.boolean(),
  mobility_assistance: z.boolean(),
  sign_language: z.boolean(),
  child_assistance: z.boolean(),
  security_clearance: z.boolean(),
  zone_certifications: z.array(z.number()).nullable(),
});
export type Volunteer = z.infer<typeof VolunteerSchema>;

export const VolunteerTaskSchema = z.object({
  id: z.number(),
  description: z.string(),
  status: z.enum(['PENDING', 'ASSIGNED', 'RESOLVED']),
  priority: z.enum(['NORMAL', 'HIGH', 'EMERGENCY']),
  created_at: z.string().datetime(),
  assigned_time: z.string().datetime().nullable(),
  acknowledged_time: z.string().datetime().nullable(),
  resolved_time: z.string().datetime().nullable(),
  response_duration: z.number().nullable(),
});
export type VolunteerTask = z.infer<typeof VolunteerTaskSchema>;

export const AccessibilityMetricsSchema = z.object({
  id: z.number(),
  timestamp: z.string().datetime(),
  avg_response_time: z.number(),
  request_categories: z.any(),
  volunteer_utilization: z.number(),
  translation_success_rate: z.number(),
  route_success_rate: z.number(),
});
export type AccessibilityMetrics = z.infer<typeof AccessibilityMetricsSchema>;
