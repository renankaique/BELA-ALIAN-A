// Endpoint Serverless da Vercel para expor APENAS as chaves públicas do Supabase
// configuradas automaticamente pela integração Supabase <-> Vercel Marketplace.
// Chaves privadas (SUPABASE_SECRET_KEY / POSTGRES_URL) NUNCA são expostas aqui.

module.exports = function handler(req, res) {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "";

  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    "";

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    configured: Boolean(url && anonKey),
    url,
    anonKey
  });
};

