export function getCookieConfig() {
  const isProduction = process.env.NODE_ENV === 'production'
  
  return {
    httpOnly: true,
    secure: isProduction, // true apenas em produção com HTTPS
    sameSite: 'lax',
    path: '/',
  }
}

export function getCookieExpiryConfig() {
  return {
    ...getCookieConfig(),
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  }
}

export function getCookieClearConfig() {
  return {
    ...getCookieConfig(),
    maxAge: 0, // Expira imediatamente
  }
} 