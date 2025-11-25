'use server';

import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function MonthlyMenuNewRedirect({ searchParams }: PageProps) {
  const params = new URLSearchParams();
  params.set('type', 'monthly');

  if (typeof searchParams.year === 'string') {
    params.set('year', searchParams.year);
  }
  if (typeof searchParams.month === 'string') {
    params.set('month', searchParams.month);
  }

  redirect(`/admin/menus/new?${params.toString()}`);
}

