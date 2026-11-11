// Conexión al registro académico (proyecto Supabase del Alumnado, esquema aparte «verificacion»).
// La llave «anon» es pública por diseño: con ella no se puede leer ninguna tabla ni ejecutar ninguna función
// de verificación; todo pasa por la función del servidor «verificacion», que solo entrega lo autorizado.
window.VERIFICACION_CONFIG = {
  supabaseUrl: "https://zflnjfdukbxejespivzl.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmbG5qZmR1a2J4ZWplc3BpdnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2NzQwMDQsImV4cCI6MjEwOTI1MDAwNH0.MHWOMHhPhsGVMgOw5_98XNa3_zNk3Zp1Y_0p-cdPEb4"
};
