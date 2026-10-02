import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  session: null as unknown,
  getSession: vi.fn(),
  limit: vi.fn(),
  select: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Headers()) }));
vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mocks.getSession } },
}));
vi.mock("@/lib/db", () => ({
  getDb: () => ({ select: mocks.select }),
}));

import { OrganizationAccessService } from "@/services/organization-access-service";

describe("OrganizationAccessService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.session = null;
    mocks.getSession.mockImplementation(async () => mocks.session);
    mocks.limit.mockResolvedValue([]);
    const query = {
      from: vi.fn(),
      where: vi.fn(),
      limit: mocks.limit,
    };
    query.from.mockReturnValue(query);
    query.where.mockReturnValue(query);
    mocks.select.mockReturnValue(query);
  });

  it("returns the active organization only when the session user is a member", async () => {
    mocks.session = {
      session: { activeOrganizationId: "org-1" },
      user: { id: "user-1", email: "user@example.com" },
    };
    mocks.limit.mockResolvedValue([{ role: "admin" }]);

    await expect(OrganizationAccessService.requireActiveOrganization()).resolves.toEqual({
      organizationId: "org-1",
      userId: "user-1",
      email: "user@example.com",
      role: "admin",
    });
  });

  it("rejects unauthenticated requests without querying memberships", async () => {
    await expect(OrganizationAccessService.requireActiveOrganization()).rejects.toThrow("Não autenticado.");
    expect(mocks.select).not.toHaveBeenCalled();
  });

  it("rejects sessions without an active organization", async () => {
    mocks.session = {
      session: { activeOrganizationId: null },
      user: { id: "user-1", email: "user@example.com" },
    };

    await expect(OrganizationAccessService.requireActiveOrganization()).rejects.toThrow(
      "Nenhuma organização ativa na sessão.",
    );
    expect(mocks.select).not.toHaveBeenCalled();
  });

  it("rejects users who are not members of the active organization", async () => {
    mocks.session = {
      session: { activeOrganizationId: "org-1" },
      user: { id: "user-1", email: "user@example.com" },
    };

    await expect(OrganizationAccessService.requireActiveOrganization()).rejects.toThrow(
      "Você não tem acesso à organização ativa.",
    );
  });
});
