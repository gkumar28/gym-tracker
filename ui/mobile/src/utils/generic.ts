// ui/mobile/src/utils/dateUtils.ts
export function formatTimestamp(dateStr: string | Date | undefined | null): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const day = d.getDate();
    const month = d.toLocaleString('en', { month: 'short' });
    const year = d.getFullYear();
    const time = d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${day} ${month}, ${year} ${time}`;
  }