// Errors from the OpenProject read layer. Messages are fixed strings and never contain the key, full URL or response body.
export type OpErrorKind =
  | 'invalid_config' | 'unauthorized' | 'forbidden' | 'not_found' | 'rate_limited'
  | 'server' | 'http' | 'empty_body' | 'bad_response' | 'network' | 'timeout';

const MESSAGES: Record<OpErrorKind, string> = {
  invalid_config: 'OpenProject settings are invalid (needs an https address, an API key and a valid date range).',
  unauthorized: 'OpenProject rejected the credentials (401). Check the API key.',
  forbidden: 'This account is not allowed to read this data (403).',
  not_found: 'The requested OpenProject address was not found (404).',
  rate_limited: 'OpenProject is rate limiting requests (429). Try again later.',
  server: 'OpenProject server error (5xx). Try again later.',
  http: 'OpenProject returned an unexpected error code.',
  empty_body: 'OpenProject returned an empty response (possibly a proxy).',
  bad_response: 'The OpenProject response was not in the expected format.',
  network: 'Couldn’t connect to OpenProject (offline or wrong address).',
  timeout: 'OpenProject took too long to respond.',
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
