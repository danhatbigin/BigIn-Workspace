// Lỗi của lớp đọc OpenProject. Message là chuỗi cố định, không bao giờ chứa key, URL đầy đủ hay body phản hồi.
export type OpErrorKind =
  | 'invalid_config' | 'unauthorized' | 'forbidden' | 'not_found' | 'rate_limited'
  | 'server' | 'http' | 'empty_body' | 'bad_response' | 'network' | 'timeout';

const MESSAGES: Record<OpErrorKind, string> = {
  invalid_config: 'Cấu hình OpenProject chưa hợp lệ (cần địa chỉ https, API key và khoảng ngày đúng).',
  unauthorized: 'OpenProject từ chối xác thực (401). Kiểm tra lại API key.',
  forbidden: 'Tài khoản không có quyền đọc dữ liệu này (403).',
  not_found: 'Không tìm thấy địa chỉ OpenProject yêu cầu (404).',
  rate_limited: 'OpenProject đang giới hạn tốc độ (429). Thử lại sau.',
  server: 'Máy chủ OpenProject lỗi (5xx). Thử lại sau.',
  http: 'OpenProject trả mã lỗi không mong đợi.',
  empty_body: 'OpenProject trả phản hồi rỗng (có thể do proxy).',
  bad_response: 'Phản hồi OpenProject không đúng định dạng mong đợi.',
  network: 'Không kết nối được tới OpenProject (mất mạng hoặc sai địa chỉ).',
  timeout: 'OpenProject phản hồi quá chậm.',
};

export class OpError extends Error {
  readonly kind: OpErrorKind;
  readonly status?: number;
  readonly retryAfterSeconds?: number;
  constructor(kind: OpErrorKind, extra: { status?: number; retryAfterSeconds?: number } = {}) {
    super(MESSAGES[kind]);
    this.name = 'OpError';
    this.kind = kind;
    this.status = extra.status;
    this.retryAfterSeconds = extra.retryAfterSeconds;
  }
}

export function kindForStatus(status: number): OpErrorKind {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 429) return 'rate_limited';
  if (status >= 500) return 'server';
  return 'http';
}
