"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import {
  createOrganizationAction,
  checkSlugAvailabilityAction,
  generateSlug,
} from "@/domain/organizations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const onboardingSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(50, "Nome muito longo"),
  slug: z
    .string()
    .min(2, "URL muito curta")
    .max(30, "URL muito longa")
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífens"),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

type SlugStatus = "idle" | "checking" | "available" | "taken" | "invalid";

const PRODUCT_NAME = "SaaS Boilerplate";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export function OnboardingForm() {
  const router = useRouter();
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");
  const [slugTouched, setSlugTouched] = useState(false);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { name: "", slug: "" },
  });

  const nameValue = form.watch("name");
  const slugValue = form.watch("slug");

  const debouncedNameForSlug = useDebounce(nameValue, 300);
  const debouncedSlugForCheck = useDebounce(slugValue, 500);

  const setSlugFromName = useCallback(() => {
    const generated = generateSlug(debouncedNameForSlug);
    if (generated && !slugTouched) {
      form.setValue("slug", generated);
    }
  }, [debouncedNameForSlug, slugTouched, form]);

  useEffect(() => {
    setSlugFromName();
  }, [setSlugFromName]);

  useEffect(() => {
    if (!slugTouched) return;
    if (!debouncedSlugForCheck || debouncedSlugForCheck.length < 2) {
      setSlugStatus("idle");
      return;
    }
    if (!/^[a-z0-9-]+$/.test(debouncedSlugForCheck)) {
      setSlugStatus("invalid");
      return;
    }
    setSlugStatus("checking");
    checkSlugAvailabilityAction(debouncedSlugForCheck).then((result) => {
      setSlugStatus(result.available ? "available" : "taken");
    });
  }, [debouncedSlugForCheck, slugTouched]);

  async function onSubmit(values: OnboardingFormValues) {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("slug", values.slug);
    try {
      const result = await createOrganizationAction(formData);
      if (result?.error) {
        const firstError = Object.values(result.error).flat()[0];
        toast.error(firstError ?? "Erro ao criar organização.");
        return;
      }
      if (result?.success && result.orgSlug) {
        router.push(`/${result.orgSlug}/dashboard`);
        return;
      }
    } catch {
      toast.error("Sessão expirada. Faça login novamente.");
      router.push("/login");
      return;
    }
    toast.error("Erro ao criar organização. Tente novamente.");
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Crie sua organização
        </CardTitle>
        <CardDescription>
          Seu espaço de trabalho no {PRODUCT_NAME}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da organização</FormLabel>
                  <FormControl>
                    <Input placeholder="Minha Empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da organização</FormLabel>
                  <div className="flex items-center gap-1 rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    <span className="pl-3 text-sm text-muted-foreground whitespace-nowrap">
                      app.dominio.com /
                    </span>
                    <FormControl>
                      <Input
                        className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                        placeholder="minha-empresa"
                        {...field}
                        onBlur={() => setSlugTouched(true)}
                      />
                    </FormControl>
                    {slugStatus === "checking" && (
                      <Loader2 className="mr-3 h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                    )}
                    {slugStatus === "available" && (
                      <Check
                        className="mr-3 h-4 w-4 shrink-0 text-green-600 dark:text-green-400"
                        aria-hidden
                      />
                    )}
                  </div>
                  {slugStatus === "checking" && (
                    <p className="text-sm text-muted-foreground">
                      Verificando disponibilidade...
                    </p>
                  )}
                  {slugStatus === "taken" && (
                    <p className="text-sm font-medium text-destructive">
                      Esta URL já está em uso
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={
                isSubmitting ||
                slugStatus === "checking" ||
                slugStatus === "taken" ||
                slugStatus === "invalid"
              }
            >
              {isSubmitting ? "Criando..." : "Criar organização"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
