import { server } from "../index"
import { Server } from "socket.io";

import { getRTPcapablities, getRouter, createLocalTransport, getLocalTransportParm, connectLocalTransport, produceLocalTransport } from "./controllers/video.controllers"

function webSocket() {
    // websocket connection
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        }
    });

    io.on('connection', (socket) => {

        socket.on('getRTPcapablities', async (req, callback) => {
            try {
                const rtpCapabilities = getRTPcapablities(req.id);
                callback({ data: rtpCapabilities });
            } catch (error) {
                callback({ error: `cannot get rtpcapblities: ${error}` });
            }
        })

        socket.on('getTransportParams', async (req, callback) => {
            try {
                const transportParams = await getLocalTransportParm(req.id, req.user);
                callback({ data: transportParams });
            } catch (error) {
                callback({ error: `cannot get transport parameters: ${error}` });
            }
        })

        socket.on('transport-connect', async (req, callback) => {
            try {
                await connectLocalTransport(req.id, req.user, req.dtlsParameters);
            } catch (error) {
                callback({ error: `cannot connect transport: ${error}` });
            }
        })

        socket.on('transport-produce', async (req, callback) => {
            try {
                const producerId = await produceLocalTransport(req.id, req.user, req.kind, req.rtpParameters);
                callback(producerId);
            } catch (error) {
                callback({ error: `cannot produce transport: ${error}` });

            }
        })
    })

}

export default webSocket;