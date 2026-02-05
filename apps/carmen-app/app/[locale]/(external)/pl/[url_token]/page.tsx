import PlExtComponent from "./_components/PlExtComponent";

interface PageProps {
  params: Promise<{ url_token: string }>;
}

export default async function PlExternalPage({ params }: PageProps) {
  const { url_token } = await params;

  return <PlExtComponent urlToken={url_token} />;
}
