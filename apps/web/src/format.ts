import { fromKey } from '../../../packages/domain/time';
export const hours = (value: number) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value);
export const shortDate = (key: string) => fromKey(key).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
export const longDate = (key: string) => fromKey(key).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });
