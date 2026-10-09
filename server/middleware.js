import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const DEFAULT_SECRETS = new Set(['', 'change-this-secret-in-.env', 'change-this-to-a-long-random-string']);
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-.env';
// Tokens signed with a publicly known secret can be forged, so production refuses to start without a real one.
if (DEFAULT_SECRETS.has(process.env.JWT_SECRET || '') || JWT_SECRET.length < 32) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set to a random string of at least 32 characters in production.');
  }
  console.warn('[security] JWT_SECRET is missing or weak — fine for local development, NOT for production.');
}

export function signToken(user) {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
}

// Protects any write route (create/update/delete/upload). Reads must stay public
// so the public site can render content without logging in.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Missing auth token.' });
  }

  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

// MIME type -> allowed extensions. Both must match: the MIME type alone is
// supplied by the browser and trivially spoofed.
const ALLOWED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/avif': ['.avif'],
  'image/gif': ['.gif'],
  'image/svg+xml': ['.svg'],
};
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

export const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_TYPES[file.mimetype]?.includes(ext)) {
      return cb(new Error('Only image files are allowed (jpg, png, webp, avif, gif, svg).'));
    }
    cb(null, true);
  },
});
