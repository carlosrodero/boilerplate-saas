import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <p className="text-8xl font-bold text-muted-foreground/30">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Página não encontrada</h1>
      <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Voltar para o início</Link>
      </Button>
    </div>
  );
}
