import { describe, test, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { default as app } from '../server.mjs';

vi.mock('../lib/prisma.mjs', () => ({
  default: {
    user: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
    authProvider: { create: vi.fn() },
    category: { create: vi.fn(), findMany: vi.fn() },
    producto: { create: vi.fn(), findMany: vi.fn(), delete: vi.fn(), update: vi.fn() },
    productDetail: { create: vi.fn(), findMany: vi.fn() },
    userSettings: { update: vi.fn(), create: vi.fn() },
    $transaction: vi.fn(),
    $queryRaw: vi.fn(),
  },
}));

vi.mock('../middleware/auth.mjs', () => ({
  default: vi.fn((req, res, next) => { req.res = { user: { id: 1, email: 'test@example.com' } }; next(); }),
}));

vi.mock('playwright', () => ({ chromium: { launch: vi.fn() } }));
vi.mock('axios', () => ({ default: { post: vi.fn() } }));
vi.mock('bcrypt', () => ({ default: { genSalt: vi.fn().mockResolvedValue('salt'), hash: vi.fn().mockResolvedValue('$2b$10$h'), compare: vi.fn().mockResolvedValue(true) } }));
vi.mock('node-cron', () => ({ default: { schedule: vi.fn() } }));

let server;
const port = 0;

beforeAll(() => {
  server = app.listen(port);
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  vi.clearAllMocks();
});

const base = () => `http://localhost:${server.address().port}`;
const get = (path) => fetch(`${base()}${path}`);
const post = (path, body) => fetch(`${base()}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const del = (path) => fetch(`${base()}${path}`, { method: 'DELETE' });
const patch = (path, body) => fetch(`${base()}${path}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

describe('GET /', () => {
  test('returns hello', async () => {
    const res = await get('/');
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('hello');
  });
});

describe('POST /register', () => {
  test('returns 400 when email and password are missing', async () => { const res = await post('/register', {}); expect(res.status).toBe(400); });
  test('returns 400 when password is too short', async () => { const res = await post('/register', { email: 'a@b.com', password: '12345' }); expect(res.status).toBe(400); const data = await res.json(); expect(data.message).toBe('Validation failed'); expect(data.errors.password).toBeDefined(); });
  test('creates new user with valid credentials', async () => { const { default: prisma } = await import('../lib/prisma.mjs'); prisma.user.findUnique.mockResolvedValue(null); prisma.user.create.mockResolvedValue({ id: 1, email: 'a@b.com', authProviders: [] }); const res = await post('/register', { email: 'a@b.com', password: 'password123', name: 'Test' }); expect(res.status).toBe(200); expect((await res.json()).token).toBeDefined(); });
  test('returns 400 when user already exists', async () => { const { default: prisma } = await import('../lib/prisma.mjs'); prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a@b.com', authProviders: [{ provider: 'local' }] }); const res = await post('/register', { email: 'a@b.com', password: 'password123' }); expect(res.status).toBe(400); });
});

describe('POST /login', () => {
  test('returns 400 when credentials are missing', async () => { const res = await post('/login', {}); expect(res.status).toBe(400); });
  test('returns 400 when user not found', async () => { const { default: prisma } = await import('../lib/prisma.mjs'); prisma.user.findUnique.mockResolvedValue(null); const res = await post('/login', { email: 'nobody@b.com', password: 'password123' }); expect(res.status).toBe(400); expect((await res.json()).message).toBe('Invalid credentials'); });
  test('logs in successfully', async () => { const { default: prisma } = await import('../lib/prisma.mjs'); prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a@b.com', passwordHash: '$2b$10$hash', authProviders: [{ provider: 'local' }] }); const res = await post('/login', { email: 'a@b.com', password: 'password123' }); expect(res.status).toBe(200); expect((await res.json()).token).toBeDefined(); });
});

describe('POST /google', () => {
  test('creates new user', async () => { const { default: prisma } = await import('../lib/prisma.mjs'); prisma.user.findUnique.mockResolvedValue(null); prisma.user.create.mockResolvedValue({ id: 1, email: 'g@g.com', authProviders: [] }); const res = await post('/google', { providerId: 'g1', name: 'G', email: 'g@g.com' }); expect(res.status).toBe(200); expect((await res.json()).token).toBeDefined(); });
  test('returns token for existing user', async () => { const { default: prisma } = await import('../lib/prisma.mjs'); prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'g@g.com', authProviders: [{ provider: 'google' }] }); const res = await post('/google', { providerId: 'g1', name: 'G', email: 'g@g.com' }); expect(res.status).toBe(200); });
});

describe('POST /addProduct', () => {
  test('creates product', async () => { const { default: prisma } = await import('../lib/prisma.mjs'); prisma.producto.create.mockResolvedValue({ id: 1, name: 'Milk', quantity: 5 }); const res = await post('/addProduct', { Name: 'Milk', quantity: 5, CategoryID: 1 }); expect(res.status).toBe(201); });
});

describe('GET /productsByIDCategory', () => {
  test('returns products', async () => { const { default: prisma } = await import('../lib/prisma.mjs'); prisma.producto.findMany.mockResolvedValue([{ id: 1, name: 'Milk' }, { id: 2, name: 'Eggs' }]); const res = await get('/productsByIDCategory?CategoryKey=1'); expect(res.status).toBe(200); expect(await res.json()).toHaveLength(2); });
});

describe('DELETE /deleteProduct/:id', () => {
  test('deletes product', async () => { const { default: prisma } = await import('../lib/prisma.mjs'); prisma.producto.delete.mockResolvedValue({ id: 1 }); const res = await del('/deleteProduct/1'); expect(res.status).toBe(200); });
});

describe('POST /saveTokenUserNotification', () => {
  test('returns 400 when missing params', async () => { const res = await post('/saveTokenUserNotification', {}); expect(res.status).toBe(400); });
  test('saves token', async () => { const { default: prisma } = await import('../lib/prisma.mjs'); prisma.user.update.mockResolvedValue({}); const res = await post('/saveTokenUserNotification', { userEmail: 'a@b.com', expoPushToken: 'token' }); expect(res.status).toBe(200); });
});

describe('PATCH /updateProductName/:id', () => {
  test('updates name', async () => { const { default: prisma } = await import('../lib/prisma.mjs'); prisma.producto.update.mockResolvedValue({ id: 1, name: 'New' }); const res = await patch('/updateProductName/1', { newName: 'New' }); expect(res.status).toBe(200); });
});

describe('POST /updateUserSettings', () => {
  test('returns 404 when user not found', async () => { const { default: prisma } = await import('../lib/prisma.mjs'); prisma.user.findUnique.mockResolvedValue(null); const res = await post('/updateUserSettings', { userEmail: 'a@b.com', group: 'reminderSettings', enabled: true }); expect(res.status).toBe(404); });
  test('updates settings', async () => { const { default: prisma } = await import('../lib/prisma.mjs'); prisma.user.findUnique.mockResolvedValue({ id: 1, name: 'Test', settings: {} }); prisma.userSettings.update.mockResolvedValue({}); const res = await post('/updateUserSettings', { group: 'reminderSettings', userEmail: 'a@b.com', enabled: true }); expect(res.status).toBe(200); });
});
