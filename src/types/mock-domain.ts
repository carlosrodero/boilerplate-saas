/**
 * Tipos compatíveis com o domínio (DOMAIN.md).
 * Quando Prisma estiver configurado, use: import type { User, Membership, Subscription } from "@prisma/client"
 */

export type Role = "OWNER" | "ADMIN" | "MEMBER";

export type SubStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "TRIALING"
  | "PAST_DUE"
  | "CANCELED"
  | "UNPAID";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
}

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: Role;
  createdAt: Date;
  user?: User;
}

export interface Subscription {
  id: string;
  organizationId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  status: SubStatus;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  createdAt: Date;
}
