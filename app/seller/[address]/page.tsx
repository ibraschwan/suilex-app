'use client';
import { use } from 'react';
import { redirect } from 'next/navigation';

export default function SellerPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  redirect(`/profile/${address}`);
}
