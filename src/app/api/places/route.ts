import { NextRequest, NextResponse } from 'next/server';
import { DESTINATIONS } from '@/data/destinations';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search')?.toLowerCase();
  const sort = searchParams.get('sort'); // 'popular' | 'price_asc' | 'price_desc'

  let filtered = [...DESTINATIONS];

  if (category && category !== 'all') {
    filtered = filtered.filter((d) => d.category === category);
  }

  if (search) {
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(search) ||
        d.state.toLowerCase().includes(search) ||
        d.tags.some((t) => t.toLowerCase().includes(search))
    );
  }

  if (sort === 'price_asc') {
    filtered.sort((a, b) => a.dailyCostBudget - b.dailyCostBudget);
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => b.dailyCostBudget - a.dailyCostBudget);
  }

  return NextResponse.json({
    destinations: filtered,
    total: filtered.length,
  });
}
