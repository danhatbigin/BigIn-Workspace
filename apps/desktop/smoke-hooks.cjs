// Test-only hooks for Playwright smoke runs. NOT included in release builds (see scripts/package-windows.mjs).
function apply(app, server) {
  if (process.env.BIGIN_SMOKE !== '1') return server;
  if (process.env.BIGIN_TEST_PROFILE) app.setPath('userData', process.env.BIGIN_TEST_PROFILE);
  if (process.env.BIGIN_TEST_OP_URL) {
    const target = new URL(process.env.BIGIN_TEST_OP_URL);
    if (target.protocol !== 'http:' || target.hostname !== '127.0.0.1') throw Error('Test endpoint must be a local mock server.');
    return target.origin;
  }
  return server;
}
module.exports = { apply };
