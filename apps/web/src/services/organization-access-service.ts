import "server-only";

import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { members } from "@/models/schema";

export class OrganizationAccessService {
  static async requireActiveOrganization() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      throw new Error("Não autenticado.");
    }

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) {
      throw new Error("Nenhuma organização ativa na sessão.");
    }

    const [membership] = await getDb()
      .select({ role: members.role })
      .from(members)
      .where(and(eq(members.organizationId, organizationId), eq(members.userId, session.user.id)))
      .limit(1);

    if (!membership) {
      throw new Error("Você não tem acesso à organização ativa.");
    }

    return { organizationId, userId: session.user.id, email: session.user.email, role: membership.role };
  }
}