import { server } from "../index"
import { Server } from "socket.io";

import { getRTPcapablities, getRouter, createLocalTransport, getLocalTransportParm } from "./controllers/video.controllers"

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
                console.log(rtpCapabilities);
                callback({ data: rtpCapabilities });
            } catch (error) {
                callback({ error: `cannot get rtpcapblities: ${error}` });
            }
        })

        socket.on('getTransportParams', async (req, callback) => {
            try {
                const transportParams = await getLocalTransportParm(req.id);
                callback({ data: transportParams });
            } catch (error) {
                callback({ error: `cannot get transport parameters: ${error}` });
            }
        })

        socket.on('transport-connect', async (req, callback) => {

        })

        socket.on('transport-produce', async (req, callback) => {

        })
    })

}

export default webSocket;