import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <MarketingLayout className="items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-extrabold">404</h1>
      <p className="text-muted-foreground">Halaman tidak ditemukan.</p>
      <Button asChild variant="solid" color="primary" radius="lg">
        <Link href="/">Kembali</Link>
      </Button>
    </MarketingLayout>
  );
}
