import { z } from "zod";

export const organizationSchema = z.object({
  name: z.string().min(2, "Informe o nome da organização."),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífens."),
});
