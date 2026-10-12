import { fromKey } from '../../../packages/domain/time';
export const hours = (value: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
export const shortDate = (key: string) => fromKey(key).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' });
export const longDate = (key: string) => fromKey(key).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
