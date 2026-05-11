# 💬 ChatFlow — Chat Colaborativo en Tiempo Real

> Sistema de chat colaborativo en tiempo real usando WebSocket puro — sin polling, sin frameworks.

## 🚀 Tecnologías

| Capa | Tecnología |
|------|-----------|
| Servidor | Node.js + módulo `ws` |
| Cliente | HTML + CSS + JavaScript (vanilla, sin frameworks) |
| Protocolo | WebSocket (RFC 6455) — comunicación bidireccional persistente |

## ✨ Funcionalidades

- ✅ Múltiples usuarios conectados simultáneamente
- ✅ Nombre de usuario asignado automáticamente al conectarse (`Usuario_1`, `Usuario_2`...)
- ✅ Posibilidad de cambiar el nombre en cualquier momento
- ✅ Notificación visible cuando alguien entra o sale del chat
- ✅ Historial de los últimos 50 mensajes al conectarse
- ✅ Selector de emojis 😊
- ✅ Interfaz moderna con tema oscuro
- ✅ Indicador de estado de conexión (verde = conectado, rojo = desconectado)

## 📁 Estructura del Proyecto

```
chat-websocket/
├── server.js       # Servidor HTTP + WebSocket (Node.js)
├── index.html      # Cliente web (SPA — HTML + CSS + JS)
├── package.json    # Configuración y dependencias npm
└── README.md       # Este archivo
```

## ⚙️ Instalación y Ejecución

### Requisitos previos
- [Node.js](https://nodejs.org/) v14 o superior

### 1. Clona el repositorio

```bash
git clone https://github.com/miguelangelno/chat-websocket.git
cd chat-websocket
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Inicia el servidor

```bash
node server.js
```

Verás en consola:
```
🚀 Servidor corriendo en http://localhost:3000
```

### 4. Abre el chat

Abre tu navegador en: **http://localhost:3000**

Para simular múltiples usuarios, abre **varias pestañas** en la misma URL.

## 🔌 Protocolo de Mensajes WebSocket

### Servidor → Cliente

| `tipo` | Campos adicionales | Descripción |
|--------|--------------------|-------------|
| `bienvenida` | `miId`, `miNombre`, `mensajes[]` | Enviado al conectarse: ID único, nombre y historial |
| `mensaje` | `autorId`, `autor`, `texto`, `hora` | Mensaje de chat broadcast a todos |
| `sistema` | `texto` | Notificación de entrada/salida/cambio de nombre |
| `miNombreCambio` | `miNombre` | Confirmación del nuevo nombre (solo al solicitante) |

### Cliente → Servidor

| `tipo` | Campos adicionales | Descripción |
|--------|--------------------|-------------|
| `mensaje` | `texto` | Enviar un mensaje al chat |
| `cambiarNombre` | `nombre` | Solicitar cambio de nombre visible |

## 🏗️ Arquitectura

```
[Navegador 1]  ←── WebSocket ──┐
[Navegador 2]  ←── WebSocket ──┤── [Servidor Node.js :3000]
[Navegador N]  ←── WebSocket ──┘
                     │
                  HTTP :3000
                     │
              sirve index.html
```

El servidor HTTP y el servidor WebSocket comparten el mismo puerto (3000). Al conectarse, el servidor asigna un **ID único** (`user_timestamp_N`) y un **nombre temporal** (`Usuario_N`). Cada mensaje se hace broadcast a todos los clientes conectados.

## 👥 Equipo

Actividad 7 — Chat Colaborativo WebSocket  
Docente: **Marcelo Antezana Camacho**

## 📄 Licencia

ISC
