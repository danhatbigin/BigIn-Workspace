import { OpError } from './errors';

const ISO = /^PT(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?$/;

// OP trả hours dạng ISO 8601 (PT8H, PT15M, PT1H30M). Ngày/tuần (P1D...) mơ hồ nên bị từ chối thay vì đoán.
export function parseIsoDuration(value: unknown): number {
  if (typeof value !== 'string') throw new OpError('bad_response');
  const m = ISO.exec(value);
  if (!m || (m[1] === undefined && m[2] === undefined && m[3] === undefined)) throw new OpError('bad_response');
  const hours = Number(m[1] ?? 0) + Number(m[2] ?? 0) / 60 + Number(m[3] ?? 0) / 3600;
  return Math.round(hours * 1e6) / 1e6;
}
