'use server';

import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function WeeklyMenuNewRedirect({ searchParams }: PageProps) {
  const params = new URLSearchParams();
  params.set('type', 'weekly');

  const weekParam =
    typeof searchParams.week === 'string'
      ? searchParams.week
      : typeof searchParams.weekStart === 'string'
      ? searchParams.weekStart
      : undefined;

  if (weekParam) {
    params.set('week', weekParam);
  }

  if (typeof searchParams.day === 'string') {
    params.set('day', searchParams.day);
  }

  redirect(`/admin/menus/new?${params.toString()}`);
}

