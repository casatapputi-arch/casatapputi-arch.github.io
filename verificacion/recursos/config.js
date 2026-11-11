// Conexión al registro académico (Supabase). La llave «anon» es pública por diseño:
// la seguridad la dan las funciones del servidor y las reglas de la base, no esta llave.
// Mientras estén vacías, las páginas muestran «servicio en preparación» y no consultan nada.
window.VERIFICACION_CONFIG = {
  supabaseUrl: "",
  anonKey: ""
};
