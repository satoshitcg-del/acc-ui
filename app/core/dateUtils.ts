import dayjs from "dayjs";

export function formatDate(dateString: Date) {
  return !dateString ? "-" : dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
}