/**
 * Configuración de API
 * 
 * Para usar en Android, cambia LOCAL_IP por la IP de tu ordenador.
 * Para obtener tu IP: ejecuta "ipconfig" en Windows y busca "Dirección IPv4"
 * 
 * Ejemplo: '192.168.1.100'
 */
export const API_CONFIG = {
  // IP local de tu ordenador (cambia esto por tu IP real)
  // Para desarrollo local, déjalo como está si solo usas web
  LOCAL_IP: '192.168.0.43', 
  
  // Puerto del servidor
  PORT: 3001,
  
  // URL base para desarrollo web
  WEB_URL: 'http://localhost:3001',
  
  // URL base para móvil (se construye automáticamente con LOCAL_IP)
  get MOBILE_URL(): string {
    return `http://${this.LOCAL_IP}:${this.PORT}`;
  }
};
