import Aedes from 'aedes'
import { createServer } from 'net'
const httpServer = require('http').createServer()
const ws = require('websocket-stream')
const port = 1883
const wsPort = 8888

const aedes = new Aedes()
const server = createServer(aedes.handle)

server.listen(port, function () {
  console.log('server started and listening on port ', port)
})

ws.createServer(
  {
    server: httpServer,
  },
  aedes.handle
)

httpServer.listen(wsPort, function () {
  console.log('websocket server listening on port', wsPort)
})

// fired when a client connects
aedes.on('client', function (client) {
  console.log(`Client Connected: ${client?.id} to broker ${aedes.id}`)
})

// fired when a client disconnects
aedes.on('clientDisconnect', function (client) {
  console.log(`Client Disconnected: ${client?.id} from broker ${aedes.id}`)
})

aedes.on('subscribe', function (subscriptions, client) {
  console.log(
    `MQTT client ${client?.id} subscribed to topics: ${subscriptions
      .map((s) => s.topic)
      .join('\n')} from broker ${aedes.id}`
  )
})

aedes.on('unsubscribe', function (subscriptions, client) {
  console.log(
    `MQTT client ${client?.id} unsubscribed to topics ${subscriptions.join(
      '\n'
    )} from broker${aedes.id}`
  )
})

// fired when a message is published
aedes.on('publish', async function (packet, client) {
  console.log(
    `Client ${
      client ? client.id : aedes.id
    } has published ${packet.payload.toString()} on ${packet.topic} to broker ${
      aedes.id
    }`
  )
})
