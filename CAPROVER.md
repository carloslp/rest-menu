# CapRover Deployment Guide

Este proyecto está configurado para desplegarse en CapRover de múltiples formas.

## Opción 1: Despliegue Multi-Servicio (Recomendado para producción)

Esta opción despliega cada componente como una aplicación separada en CapRover, permitiendo escalado independiente.

### Paso 1: Crear las aplicaciones en CapRover

Crear tres aplicaciones en CapRover:
1. `rest-menu-backend` - Servicio gRPC
2. `rest-menu-proxy` - Proxy Envoy
3. `rest-menu-frontend` - Aplicación React

### Paso 2: Configurar variables de entorno

**Para rest-menu-proxy:**
- Actualizar `proxy/envoy.yaml` antes del despliegue para apuntar al backend:
  ```yaml
  address: rest-menu-backend.captain-overlay-network
  port_value: 50051
  ```

**Para rest-menu-frontend:**
- El frontend se conecta al proxy a través de la URL pública del proxy.

### Paso 3: Desplegar cada servicio

Para cada aplicación, ejecutar desde el directorio correspondiente:

**Backend:**
```bash
cd backend
tar -czf deploy.tar.gz *
# Subir deploy.tar.gz a rest-menu-backend en CapRover
```

**Proxy:**
```bash
cd proxy
tar -czf deploy.tar.gz *
# Subir deploy.tar.gz a rest-menu-proxy en CapRover
```

**Frontend:**
```bash
cd frontend
tar -czf deploy.tar.gz *
# Subir deploy.tar.gz a rest-menu-frontend en CapRover
```

### Paso 4: Exponer las URLs

- Habilitar HTTPS y configurar dominios personalizados para el frontend
- El proxy puede permanecer interno o exponerse si es necesario

## Opción 2: Despliegue Unificado (Más Simple)

Usar el `Dockerfile.caprover` que combina todos los servicios en un solo contenedor.

### Configuración

El archivo `captain-definition` en la raíz del proyecto apunta a `Dockerfile.caprover`, que:
- Construye el backend (Go)
- Construye el frontend (React)
- Configura Envoy proxy
- Utiliza supervisord para ejecutar los tres servicios
- Expone el puerto 80 para CapRover

### Despliegue

1. Asegurarse de que `captain-definition` esté configurado correctamente:
   ```json
   {
     "schemaVersion": 2,
     "dockerfilePath": "./Dockerfile.caprover"
   }
   ```

2. Crear un archivo tar del proyecto completo:
   ```bash
   tar -czf deploy.tar.gz --exclude=node_modules --exclude=.git --exclude=backend/menu.db .
   ```

3. Subir `deploy.tar.gz` a la aplicación en CapRover

4. CapRover construirá y desplegará automáticamente

### Volúmenes Persistentes (Opcional)

Para mantener la base de datos SQLite entre reinicios:
1. En CapRover, ir a la configuración de la aplicación
2. Agregar un volumen persistente: `/app/backend/menu.db`

## Verificación del Despliegue

Después del despliegue, verificar que:
1. El backend está corriendo en el puerto 50051
2. Envoy proxy está accesible en el puerto 8080
3. El frontend carga correctamente
4. Las llamadas API funcionan desde el frontend al backend

## Solución de Problemas

### Error de certificados durante la construcción
Si aparece un error de certificados TLS durante `go mod download`, asegurarse de que el servidor CapRover tenga conectividad a internet adecuada.

### Servicios no se comunican
En el despliegue multi-servicio, verificar que los nombres de los servicios en `envoy.yaml` coincidan con los nombres de las aplicaciones en CapRover.

### Frontend no se conecta al backend
Verificar que la configuración del frontend apunte correctamente a la URL del proxy:
- En desarrollo local: `http://localhost:8080`
- En CapRover: `https://rest-menu-proxy.your-domain.com` o la URL interna

## Configuración de Puertos

| Servicio  | Puerto Interno | Puerto Expuesto en CapRover |
|-----------|---------------|----------------------------|
| Backend   | 50051         | No exponer (interno)        |
| Proxy     | 8080          | Opcional                    |
| Frontend  | 80            | 80/443 (HTTPS)              |

## Notas Adicionales

- La base de datos SQLite se crea automáticamente al iniciar
- Los datos de ejemplo se insertan en el primer arranque
- El proyecto utiliza gRPC-Web para la comunicación frontend-backend
- Envoy actúa como traductor entre gRPC y gRPC-Web
