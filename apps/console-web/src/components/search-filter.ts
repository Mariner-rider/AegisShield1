export interface FilterState { query: string; severity?: string; environment?: string; from?: string; to?: string; }
export function applySearch<T extends Record<string, any>>(items: T[], filter: FilterState): T[] {
  return items.filter((i) => {
    const raw = JSON.stringify(i).toLowerCase();
    const q = filter.query.toLowerCase();
    return !q || raw.includes(q);
  });
}
