import { OnlineGalleryPage } from "@/components/page/OnlineGalleryPage";

type PageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { sessionId } = await params;
  return <OnlineGalleryPage sessionId={sessionId} />;
}
