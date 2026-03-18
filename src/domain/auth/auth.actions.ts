"use server";

import { z } from "zod";
import { requireAuth } from "./auth.service";

const UpdateProfileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
});

export type UpdateProfileResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Atualiza o nome do usuário no perfil.
 * Stub: em desenvolvimento retorna sucesso sem persistir.
 */
export async function updateUserProfileAction(
  formData: FormData
): Promise<UpdateProfileResult> {
  await requireAuth();

  const parsed = UpdateProfileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors.name?.[0];
    return { success: false, error: first ?? "Dados inválidos" };
  }

  // TODO: implementar com prisma.user.update({ where: { id: session.user.id }, data: { name: parsed.data.name } })
  return { success: true };
}
