// ============================================
// SERVIDOR WEBSOCKET - Chat Colaborativo
// ============================================

const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

// Crear servidor HTTP para servir el index.html
const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, "index.html");
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Archivo no encontrado");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

// Crear servidor WebSocket encima del HTTP
const wss = new WebSocket.Server({ server });

// Historial de mensajes (máximo 50)
const historial = [];

// Contador para nombres e IDs automáticos
let contadorUsuarios = 1;

// Cuando se conecta un nuevo usuario
wss.on("connection", (ws) => {
  // Asignar ID único independiente del nombre
  ws.id = `user_${Date.now()}_${contadorUsuarios}`;
  ws.nombre = `Usuario_${contadorUsuarios++}`;

  console.log(`✅ ${ws.nombre} (${ws.id}) se conectó`);

  // Enviar al usuario su propio ID y nombre + historial
  ws.send(
    JSON.stringify({
      tipo: "bienvenida",
      miId: ws.id,
      miNombre: ws.nombre,
      mensajes: historial,
    })
  );

  // Notificar a todos que alguien se unió
  broadcast({
    tipo: "sistema",
    texto: `${ws.nombre} se unió al chat 👋`,
  });

  // Cuando llega un mensaje del usuario
  ws.on("message", (data) => {
    const msg = JSON.parse(data);

    // Si el usuario quiere cambiar su nombre
    if (msg.tipo === "cambiarNombre") {
      const nombreViejo = ws.nombre;
      ws.nombre = msg.nombre || ws.nombre;
      // Avisar al usuario su nuevo nombre
      ws.send(
        JSON.stringify({
          tipo: "miNombreCambio",
          miNombre: ws.nombre,
        })
      );
      broadcast({
        tipo: "sistema",
        texto: `${nombreViejo} ahora se llama ${ws.nombre}`,
      });
      return;
    }

    // Mensaje normal de chat
    const mensaje = {
      tipo: "mensaje",
      autorId: ws.id, // ID único (no se confunde con nombres iguales)
      autor: ws.nombre,
      texto: msg.texto,
      hora: new Date().toLocaleTimeString("es-BO", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Guardar en historial
    historial.push(mensaje);
    if (historial.length > 50) historial.shift(); // máximo 50 mensajes

    // Enviar a todos
    broadcast(mensaje);
  });

  // Cuando un usuario se desconecta
  ws.on("close", () => {
    console.log(`❌ ${ws.nombre} se desconectó`);
    broadcast({
      tipo: "sistema",
      texto: `${ws.nombre} salió del chat 👋`,
    });
  });
});

// Función para enviar a TODOS los conectados
function broadcast(data) {
  const mensaje = JSON.stringify(data);
  wss.clients.forEach((cliente) => {
    if (cliente.readyState === WebSocket.OPEN) {
      cliente.send(mensaje);
    }
  });
}

// Iniciar en puerto 3000
server.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
