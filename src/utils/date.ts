function pad(n: number): string {
  return n < 10 ? '0' + n : '' + n;
}

export function formatDate(val?: string, showTime = false): string {
  if (!val) {
    return '';
  }
  const d = new Date(val);
  if (isNaN(d.getTime())) {
    return val;
  }
  const day = pad(d.getDate());
  const m = pad(d.getMonth() + 1);
  const y = d.getFullYear();
  if (showTime) {
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    return hh + ':' + mm + ', ' + day + '/' + m + '/' + y;
  }
  return day + '/' + m + '/' + y;
}

export function isOverdue(dueDate?: string, status?: string): boolean {
  if (!dueDate || status === 'done') {
    return false;
  }
  const d = new Date(dueDate);
  if (isNaN(d.getTime())) {
    return false;
  }
  return d.getTime() < Date.now();
}

export function daysLeft(dueDate?: string): number {
  if (!dueDate) {
    return -1;
  }
  const d = new Date(dueDate);
  if (isNaN(d.getTime())) {
    return -1;
  }
  const diff = d.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default {
  formatDate,
  isOverdue,
  daysLeft,
};

