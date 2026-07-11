import { z } from 'zod';

export const UnifiedDecisionSchema = z.object({
  id: z.number(),
  source_ai_domain: z.string(),
  action_code: z.string(),
  priority_level: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'EXECUTED', 'OVERRIDDEN']),
  target_zone_id: z.number().nullable(),
  confidence_score: z.number(),
  supporting_ai_domains: z.array(z.string()).nullable(),
  human_approval_required: z.boolean(),
  trigger_event: z.string().nullable(),
  execution_status: z.string(),
  timestamp: z.string().datetime(),
});
export type UnifiedDecision = z.infer<typeof UnifiedDecisionSchema>;

export const PlatformHealthSchema = z.object({
  id: z.number(),
  service_name: z.string(),
  status: z.enum(['HEALTHY', 'DEGRADED', 'OFFLINE']),
  last_heartbeat: z.string().datetime(),
});
export type PlatformHealth = z.infer<typeof PlatformHealthSchema>;
