# Quick Start - CapRover Deployment

## 🚀 Despliegue Rápido (5 minutos)

### Opción 1: Despliegue Unificado (Más Fácil)

1. **Crear aplicación en CapRover**
   - Nombre: `rest-menu`
   - Habilitar HTTPS
   - No exponer como webapp (CapRover lo hará automáticamente)

2. **Preparar el proyecto**
   ```bash
   # Clonar el repositorio
   git clone <your-repo-url>
   cd rest-menu
   
   # Crear archivo tar (excluir archivos innecesarios)
   tar -czf deploy.tar.gz \
     --exclude=node_modules \
     --exclude=.git \
     --exclude=backend/menu.db \
     --exclude=frontend/build \
     .
   ```

3. **Desplegar**
   - Ir a CapRover → Apps → rest-menu
   - Pestaña "Deployment"
   - Subir `deploy.tar.gz`
   - Esperar a que se construya (5-10 minutos)
   - CapRover usará automáticamente `captain-definition` → `Dockerfile.caprover`

4. **Configurar dominio (opcional)**
   - Habilitar HTTPS
   - Asignar dominio: `menu.tu-dominio.com`

5. **¡Listo!** 🎉
   - Acceder a tu aplicación en la URL asignada
   - El menú público estará disponible inmediatamente
   - Panel admin: `/admin`

### Opción 2: Despliegue Multi-Servicio (Producción)

**Paso 1: Crear 3 aplicaciones en CapRover**
- `rest-menu-backend` (No exponer como webapp)
- `rest-menu-proxy` (No exponer como webapp)
- `rest-menu-frontend` (Habilitar HTTPS + dominio)

**Paso 2: Actualizar configuración de Envoy**

Editar `proxy/envoy.yaml` antes de desplegar:
```yaml
# Línea 60 - Cambiar de "backend" a:
address: srv-captain--rest-menu-backend
port_value: 50051
```

**Paso 3: Desplegar Backend**
```bash
cd backend
tar -czf deploy.tar.gz *
# Subir a rest-menu-backend
```

**Paso 4: Desplegar Proxy**
```bash
cd proxy
tar -czf deploy.tar.gz *
# Subir a rest-menu-proxy
```

**Paso 5: Desplegar Frontend**
```bash
cd frontend
tar -czf deploy.tar.gz *
# Subir a rest-menu-frontend
```

**Paso 6: Configurar variables de entorno en Frontend**

En la app `rest-menu-frontend`:
- Variable: `REACT_APP_API_URL`
- Valor: `https://srv-captain--rest-menu-proxy:8080`
  
O usar la URL pública del proxy si lo expones.

## 📦 Volúmenes Persistentes (Recomendado)

### Opción 1 (Unificada):
- Path: `/app/backend/menu.db`
- Label: `database`

### Opción 2 (Multi-Servicio):
En `rest-menu-backend`:
- Path: `/app/menu.db`
- Label: `database`

## 🔧 Troubleshooting Rápido

### Error: "Cannot connect to backend"
- Verificar que el backend está corriendo: `docker logs <container-id>`
- En multi-servicio: verificar nombres de servicios en envoy.yaml

### Error: "Build failed"
- Revisar logs de construcción en CapRover
- Verificar que hay suficiente memoria (mínimo 2GB recomendado)
- Si falla `go mod download`: problema de red, reintentar

### Frontend carga pero API no funciona
- Verificar configuración de Envoy en puerto 8080
- Verificar CORS en proxy/envoy.yaml
- Revisar logs del proxy

## 📊 Recursos Recomendados

| Servicio | RAM | CPU |
|----------|-----|-----|
| Unified  | 2GB | 1 vCPU |
| Backend  | 512MB | 0.5 vCPU |
| Proxy    | 256MB | 0.25 vCPU |
| Frontend | 256MB | 0.25 vCPU |

## 🔗 Enlaces Útiles

- [Documentación Completa](./CAPROVER.md)
- [Arquitectura](./ARCHITECTURE.md)
- [Detalles de Implementación](./IMPLEMENTATION.md)
- [README del Proyecto](./README.project.md)

## ✅ Checklist Post-Despliegue

- [ ] Aplicación accesible vía HTTPS
- [ ] Menú público carga correctamente
- [ ] Panel admin funciona (`/admin`)
- [ ] Operaciones CRUD funcionan
- [ ] Datos persisten después de reinicio (si configuraste volúmenes)
- [ ] Logs sin errores críticos
- [ ] Health check pasa (solo opción unificada)

## 🎯 Próximos Pasos

1. Configurar backup de base de datos
2. Configurar monitoreo (opcional)
3. Personalizar datos del restaurante
4. Agregar categorías y platos propios
5. Configurar dominio personalizado
6. Habilitar autenticación en panel admin (TODO)
