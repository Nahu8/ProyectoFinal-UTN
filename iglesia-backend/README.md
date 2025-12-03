# Backend - Iglesia Cristiana

Backend API para la aplicación de iglesia cristiana construido con Node.js y Express.

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Asegúrate de tener MongoDB corriendo localmente o configura la URI en el archivo `.env`.

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## API Endpoints

### Eventos
- `GET /api/events` - Obtener todos los eventos
- `POST /api/events` - Crear un nuevo evento

### Ministerios
- `GET /api/ministries` - Obtener todos los ministerios
- `POST /api/ministries` - Crear un nuevo ministerio

### Contacto
- `POST /api/contact` - Enviar un mensaje de contacto
- `GET /api/contact` - Obtener todos los mensajes (admin)

### Health Check
- `GET /api/health` - Verificar estado del servidor

