import { z } from 'zod';

export const EmergencySeverityMatrixSchema = z.object({
  id: z.number(),
  level: z.enum(['ADVISORY', 'MINOR', 'MAJOR', 'CRITICAL', 'CATASTROPHIC']),
  response_sla_mins: z.number(),
  required_roles: z.array(z.string()),
  notification_scope: z.string(),
  escalation_policy: z.string(),
});
export type EmergencySeverityMatrix = z.infer<typeof EmergencySeverityMatrixSchema>;

export const EmergencyIncidentSchema = z.object({
  id: z.number(),
  severity: z.string(),
  incident_type: z.string(),
  zone_id: z.number(),
  status: z.enum(['ACTIVE', 'RESOLVED']),
  timestamp: z.string().datetime(),
});
export type EmergencyIncident = z.infer<typeof EmergencyIncidentSchema>;

export const ProtocolDocumentSchema = z.object({
  id: z.number(),
  title: z.string(),
  content_text: z.string(),
  category: z.enum(['MEDICAL', 'FIRE', 'SECURITY', 'WEATHER', 'LOST_CHILD', 'ACCESSIBILITY', 'TRANSPORT', 'CROWD_MANAGEMENT']),
  tags: z.array(z.string()).nullable(),
});
export type ProtocolDocument = z.infer<typeof ProtocolDocumentSchema>;

export const KnowledgeQuerySchema = z.object({
  id: z.number(),
  user_id: z.number().nullable(),
  question: z.string(),
  ai_answer: z.string(),
  cited_protocol_id: z.number().nullable(),
  timestamp: z.string().datetime(),
});
export type KnowledgeQuery = z.infer<typeof KnowledgeQuerySchema>;
