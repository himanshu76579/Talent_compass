import { z } from 'zod';
export const fail = (status, message) => Object.assign(new Error(message), { status });
export function parse(schema, value) {
  const result = schema.safeParse(value);
  if (!result.success) throw fail(400, result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; '));
  return result.data;
}
export function deadline(value) {
  if (typeof value !== 'string') return NaN;
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return NaN;
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T23:59:00` : value).getTime();
}
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})?)?$/)
  .refine(v => Number.isFinite(deadline(v)), 'Invalid date');
export const credentials = z.object({ email: z.email().transform(v => v.toLowerCase()), password: z.string().min(1).max(72) });
export const registration = credentials.extend({ password: z.string().min(8).max(72), firstName: z.string().trim().min(1).max(100), lastName: z.string().trim().max(100).default('') });
export const todoInput = z.object({ description: z.string().trim().min(1).max(1000), done: z.boolean().optional(), targetDate: date,
  category: z.string().max(100).nullable().optional(), skill: z.string().max(200).nullable().optional(),
  priority: z.enum(['HIGH','MEDIUM','LOW']).nullable().optional(), estimatedHours: z.number().min(0).max(10000).nullable().optional(),
  roadmapStepNo: z.number().int().min(1).nullable().optional()
});
export const questionInput = z.object({ analysisId: z.string().regex(/^[a-f\d]{24}$/i), conversationId: z.string().max(300).nullish(), question: z.string().trim().min(1).max(5000) });
const strings = z.array(z.string()).max(100).default([]);
export const analysisOutput = z.object({
  atsScore: z.number().int().min(0).max(100), summary: z.string(), resumeSummary: z.string(), jobDescriptionSummary: z.string(), aiAnalysisSummary: z.string(),
  skillsPresent: strings, missingSkills: strings, weakSkills: strings, projectGaps: strings,
  roadmap: z.array(z.object({ stepNo: z.number().int(), title: z.string(), skill: z.string(), description: z.string(), estimatedDays: z.number(), tasks: strings })).default([]),
  companyReadinessPlan: z.object({ codingTopicsToRevise: strings, expectedInterviewQuestions: strings, mustImprove: strings, resumeBulletSuggestions: strings, resumeKeywordsToAdd: strings,
    sevenDayPlan: z.array(z.object({ day: z.number(), task: z.string() })).default([]) }).default({}),
  interviewQuestions: z.array(z.object({ question: z.string(), relatedSkill: z.string(), difficulty: z.string(), whyAsked: z.string(), answerHint: z.string() })).default([]),
  todoTasks: z.array(z.object({ title: z.string().max(300), description: z.string().max(650), skill: z.string(), day: z.number().int().min(1).max(365), estimatedHours: z.number().min(0).max(10000), priority: z.enum(['HIGH','MEDIUM','LOW']), roadmapStepNo: z.number().int().min(1), category: z.string() })).max(30).default([]),
  learningSources: z.array(z.object({ skill: z.string(), officialDocumentation: z.string(), tutorials: strings, practicePlatforms: strings, miniProjectIdeas: strings })).default([]),
  todoSaveStatus: z.string().default('')
});
export const analysisJsonSchema = z.toJSONSchema(analysisOutput);
