import { redirect } from 'next/navigation';

export default async function QueryRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  if (params?.search) {
    redirect(`/document-intelligence?search=${encodeURIComponent(params.search)}`);
  }
  redirect('/document-intelligence');
}
