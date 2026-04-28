import { createHmac } from 'crypto';

type SessionSubject = 'admin' | 'delegate';

export interface SessionTokenPayload {
  sub: SessionSubject;
  entityId: number;
  teamId?: number;
  exp: number;
}

const SESSION_SECRET =
  process.env.SESSION_TOKEN_SECRET ?? 'campeonato-dev-secret';

function encodeBase64Url(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(value: string) {
  return createHmac('sha256', SESSION_SECRET)
    .update(value)
    .digest('base64url');
}

export function createSessionToken(
  payload: Omit<SessionTokenPayload, 'exp'>,
  expiresInSeconds: number,
) {
  const tokenPayload: SessionTokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  const encodedPayload = encodeBase64Url(JSON.stringify(tokenPayload));
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionTokenPayload | null {
  const [encodedPayload, signature] = token.split('.');

  if (!encodedPayload || !signature) {
    return null;
  }

  if (sign(encodedPayload) !== signature) {
    return null;
  }

  const payload = JSON.parse(
    decodeBase64Url(encodedPayload),
  ) as SessionTokenPayload;

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}

export function extractBearerToken(authorization?: string) {
  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}
