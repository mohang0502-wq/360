// End-to-end API tests against a running server (node:test, no extra deps).
//
//   API_URL=http://localhost:4000 ADMIN_USER=admin@360.com ADMIN_PASSWORD=… npm run test:api
//
// Every record the suite creates is prefixed "zz-test-" and deleted again at
// the end, so it is safe to run against a development database. The one
// exception is the test enquiry: there is no delete endpoint for contact
// submissions, so it is left with status "archived". Do NOT point it at production.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

const API = process.env.API_URL || 'http://localhost:4000';
const USER = process.env.ADMIN_USER || 'admin@360.com';
const PASSWORD = process.env.ADMIN_PASSWORD;
const TAG = `zz-test-${Date.now()}`;
let token = '';
const created = { categories: [], services: [], portfolio: [], media: [], sections: [], contacts: [] };

async function call(method, path, { body, auth = true, form, raw } = {}) {
  const headers = {};
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) payload = form;
  else if (raw !== undefined) { headers['Content-Type'] = 'application/json'; payload = raw; }
  else if (body !== undefined) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
  const res = await fetch(`${API}${path}`, { method, headers, body: payload });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json, headers: res.headers };
}

before(async () => {
  assert.ok(PASSWORD, 'Set ADMIN_PASSWORD to run the API tests.');
  const { status, json } = await call('POST', '/api/admin/login', { body: { username: USER, password: PASSWORD }, auth: false });
  assert.equal(status, 200, `login failed: ${JSON.stringify(json)}`);
  token = json.token;
});

after(async () => {
  for (const id of created.media) await call('DELETE', `/api/media/${id}?force=1`);
  for (const [page, section] of created.sections) await call('DELETE', `/api/sections/${page}/${section}`);
  for (const id of created.portfolio) await call('DELETE', `/api/portfolio/${id}`);
  for (const id of created.services) await call('DELETE', `/api/services/${id}`);
  for (const id of created.categories.reverse()) await call('DELETE', `/api/categories/${id}`);
  for (const id of created.contacts) await call('PUT', `/api/contact-submissions/${id}`, { body: { status: 'archived', admin_notes: 'automated test' } });
});

/* ------------------------------- health & auth ------------------------------ */

test('health check reports MySQL connected', async () => {
  const { status, json } = await call('GET', '/api/health', { auth: false });
  assert.equal(status, 200);
  assert.equal(json.ok, true);
});

test('security headers are present', async () => {
  const { headers } = await call('GET', '/api/health', { auth: false });
  assert.equal(headers.get('x-content-type-options'), 'nosniff');
  assert.equal(headers.get('x-frame-options'), 'DENY');
  assert.equal(headers.get('x-powered-by'), null);
});

test('login rejects missing and wrong credentials', async () => {
  assert.equal((await call('POST', '/api/admin/login', { body: {}, auth: false })).status, 400);
  assert.equal((await call('POST', '/api/admin/login', { body: { username: USER, password: 'wrong-password' }, auth: false })).status, 401);
});

test('write routes require a valid token', async () => {
  const noToken = await fetch(`${API}/api/categories`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(noToken.status, 401);
  const badToken = await fetch(`${API}/api/services`, { method: 'POST', headers: { Authorization: 'Bearer not-a-token', 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(badToken.status, 401);
  assert.equal((await fetch(`${API}/api/contact-submissions`)).status, 401);
  assert.equal((await fetch(`${API}/api/media`)).status, 401);
});

test('change-password validates input', async () => {
  assert.equal((await call('POST', '/api/admin/change-password', { body: {} })).status, 400);
  assert.equal((await call('POST', '/api/admin/change-password', { body: { currentPassword: PASSWORD, newPassword: 'short' } })).status, 400);
  assert.equal((await call('POST', '/api/admin/change-password', { body: { currentPassword: 'wrong', newPassword: 'long-enough-password' } })).status, 401);
});

test('malformed JSON and unknown routes get JSON errors', async () => {
  const bad = await call('POST', '/api/contact', { raw: '{not json', auth: false });
  assert.equal(bad.status, 400);
  assert.match(bad.json.message, /Malformed JSON/);
  const missing = await call('GET', '/api/does-not-exist', { auth: false });
  assert.equal(missing.status, 404);
});

/* ------------------------------- site settings ------------------------------ */

test('site settings: read and idempotent update', async () => {
  const { status, json: site } = await call('GET', '/api/site', { auth: false });
  assert.equal(status, 200);
  assert.ok(site.site_name);
  assert.equal((await call('PUT', '/api/site', { body: site })).status, 200);
  const again = await call('GET', '/api/site', { auth: false });
  assert.equal(again.json.site_name, site.site_name);
});

/* ---------------------------------- contact --------------------------------- */

test('contact: validates and persists enquiries', async () => {
  assert.equal((await call('POST', '/api/contact', { body: { name: 'x' }, auth: false })).status, 400);
  assert.equal((await call('POST', '/api/contact', { body: { name: 'x', email: 'not-an-email', message: 'hi' }, auth: false })).status, 400);
  const ok = await call('POST', '/api/contact', { body: { name: TAG, email: 'qa@example.com', message: 'automated test enquiry', service: 'Clipping Path' }, auth: false });
  assert.equal(ok.status, 200);
  assert.ok(ok.json.id);
  created.contacts.push(ok.json.id);
  const list = await call('GET', '/api/contact-submissions');
  const row = list.json.find((r) => r.id === ok.json.id);
  assert.ok(row, 'submission is listed for admins');
  assert.equal(row.status, 'new');
  assert.equal((await call('PUT', `/api/contact-submissions/${ok.json.id}`, { body: { status: 'read', admin_notes: 'seen' } })).status, 200);
  assert.equal((await call('PUT', `/api/contact-submissions/${ok.json.id}`, { body: { status: 'bogus' } })).status, 400);
  assert.equal((await call('PUT', '/api/contact-submissions/99999999', { body: { status: 'read' } })).status, 404);
  assert.equal((await call('PUT', '/api/contact-submissions/abc', { body: { status: 'read' } })).status, 400);
});

/* -------------------------------- categories -------------------------------- */

test('categories: CRUD, validation, duplicates, both listing modes', async () => {
  assert.equal((await call('POST', '/api/categories', { body: { group_type: 'nope', name: 'x', slug: 'x' } })).status, 400);
  const parent = await call('POST', '/api/categories', { body: { group_type: 'service', name: `${TAG} parent`, slug: `${TAG}-parent` } });
  assert.equal(parent.status, 200);
  created.categories.push(parent.json.id);
  const child = await call('POST', '/api/categories', { body: { group_type: 'service', name: `${TAG} child`, slug: `${TAG}-child`, parent_id: parent.json.id } });
  assert.equal(child.status, 200);
  created.categories.push(child.json.id);
  assert.equal((await call('POST', '/api/categories', { body: { group_type: 'service', name: 'dup', slug: `${TAG}-parent` } })).status, 409);

  const all = await call('GET', '/api/categories', { auth: false });
  assert.equal(all.status, 200, 'listing without ?group must not error');
  assert.equal(all.json.find((c) => c.id === child.json.id).parent_name, `${TAG} parent`);
  const grouped = await call('GET', '/api/categories?group=service', { auth: false });
  assert.ok(grouped.json.some((c) => c.id === parent.json.id));

  assert.equal((await call('PUT', `/api/categories/${child.json.id}`, { body: { name: `${TAG} renamed`, slug: `${TAG}-child`, parent_id: parent.json.id } })).status, 200);
  assert.equal((await call('PUT', `/api/categories/${child.json.id}`, { body: { name: 'self', slug: `${TAG}-self`, parent_id: child.json.id } })).status, 400);
  assert.equal((await call('PUT', '/api/categories/99999999', { body: { name: 'x', slug: 'x' } })).status, 404);
  assert.equal((await call('DELETE', '/api/categories/99999999')).status, 404);
});

/* --------------------------------- services --------------------------------- */

test('services: CRUD with category join', async () => {
  const cat = created.categories[0];
  assert.equal((await call('POST', '/api/services', { body: { type: 'other', title: 'x' } })).status, 400);
  const svc = await call('POST', '/api/services', { body: { type: 'manual', title: TAG, description: 'desc', category_id: cat, items: ['a', 'b'] } });
  assert.equal(svc.status, 200);
  created.services.push(svc.json.id);
  const list = await call('GET', '/api/services?type=manual', { auth: false });
  const row = list.json.find((s) => s.id === svc.json.id);
  assert.deepEqual(row.items_json, ['a', 'b']);
  assert.equal(row.category_name, `${TAG} parent`);
  assert.equal((await call('PUT', `/api/services/${svc.json.id}`, { body: { title: `${TAG} v2`, items: ['c'] } })).status, 200);
  const updated = (await call('GET', '/api/services', { auth: false })).json.find((s) => s.id === svc.json.id);
  assert.equal(updated.title, `${TAG} v2`);
  assert.equal((await call('PUT', `/api/services/${svc.json.id}`, { body: {} })).status, 400);
  assert.equal((await call('PUT', '/api/services/99999999', { body: { title: 'x' } })).status, 404);
});

/* --------------------------------- portfolio -------------------------------- */

test('portfolio: CRUD, filters and validation', async () => {
  assert.equal((await call('POST', '/api/portfolio', { body: { type: 'manual', caption: 'x' } })).status, 400);
  const item = await call('POST', '/api/portfolio', { body: { type: 'ai', caption: TAG, before_image: '/images/360.png', after_image: '/images/360.png' } });
  assert.equal(item.status, 200);
  created.portfolio.push(item.json.id);
  const ai = await call('GET', '/api/portfolio?type=ai', { auth: false });
  assert.ok(ai.json.some((p) => p.id === item.json.id));
  const manual = await call('GET', '/api/portfolio?type=manual', { auth: false });
  assert.ok(!manual.json.some((p) => p.id === item.json.id), 'type filter applies');
  assert.equal((await call('PUT', `/api/portfolio/${item.json.id}`, { body: { caption: 'missing fields' } })).status, 400);
  assert.equal((await call('PUT', `/api/portfolio/${item.json.id}`, { body: { type: 'ai', caption: `${TAG} v2`, before_image: '/images/360.png', after_image: '/images/360.png' } })).status, 200);
});

/* ------------------------------ page sections ------------------------------- */

test('page sections: upsert, read, validation, delete', async () => {
  const page = 'zzTest';
  const section = TAG.replace(/[^A-Za-z0-9_-]/g, '');
  created.sections.push([page, section]);
  assert.equal((await call('PUT', `/api/sections/${page}/${section}`, { body: { content: 'a string' } })).status, 400);
  assert.equal((await call('PUT', `/api/sections/${page}/${section}`, { body: { content: { title: 'v1' } } })).status, 200);
  assert.equal((await call('PUT', `/api/sections/${page}/${section}`, { body: { content: { title: 'v2' } } })).status, 200);
  const rows = (await call('GET', `/api/sections/${page}`, { auth: false })).json;
  assert.equal(rows.filter((r) => r.section_key === section).length, 1, 'upsert must not duplicate');
  assert.equal(rows.find((r) => r.section_key === section).content_json.title, 'v2');
  assert.equal((await call('PUT', `/api/sections/${page}/bad%20key`, { body: { content: {} } })).status, 400);
});

/* ---------------------------------- media ----------------------------------- */

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const pngForm = (name = 'pixel.png', type = 'image/png', data = PNG) => {
  const form = new FormData();
  form.append('image', new Blob([data], { type }), name);
  return form;
};

test('media: upload validation, replace rewrites references, in-use delete guard', async () => {
  assert.equal((await call('POST', '/api/upload', { form: pngForm(), auth: false })).status, 401);
  assert.equal((await call('POST', '/api/upload', { form: pngForm('evil.html', 'image/png') })).status, 400);
  assert.equal((await call('POST', '/api/upload', { form: pngForm('note.txt', 'text/plain', Buffer.from('hi')) })).status, 400);

  const up = await call('POST', '/api/upload', { form: pngForm() });
  assert.equal(up.status, 200);
  assert.match(up.json.url, /^\/uploads\/.+\.png$/);
  created.media.push(up.json.id);

  const file = await fetch(`${API}${up.json.url}`);
  assert.equal(file.status, 200);
  assert.match(file.headers.get('content-security-policy') || '', /sandbox/);

  // reference it from a section, then replace the file
  const page = 'zzTest';
  const section = `${TAG}-media`.replace(/[^A-Za-z0-9_-]/g, '');
  created.sections.push([page, section]);
  await call('PUT', `/api/sections/${page}/${section}`, { body: { content: { image: up.json.url } } });

  const del = await call('DELETE', `/api/media/${up.json.id}`);
  assert.equal(del.status, 409, 'in-use image must not be deleted silently');
  assert.ok(del.json.usedIn.some((u) => u.includes(section)));

  const replaced = await call('PUT', `/api/media/${up.json.id}/replace`, { form: pngForm('pixel2.png') });
  assert.equal(replaced.status, 200);
  assert.notEqual(replaced.json.url, up.json.url);
  const sectionRow = (await call('GET', `/api/sections/${page}`, { auth: false })).json.find((r) => r.section_key === section);
  assert.equal(sectionRow.content_json.image, replaced.json.url, 'references follow the replacement');
  assert.equal((await fetch(`${API}${up.json.url}`)).status, 404, 'old file removed');
  assert.equal((await fetch(`${API}${replaced.json.url}`)).status, 200);

  assert.equal((await call('PUT', '/api/media/99999999/replace', { form: pngForm() })).status, 404);
  const listed = (await call('GET', '/api/media')).json;
  assert.ok(listed.some((m) => m.id === up.json.id));
});
