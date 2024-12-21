import * as mediasoup from 'mediasoup';
import { Request, Response, NextFunction } from "express";
import * as dotenv from 'dotenv';

import mediaCodecs from "./codec"

dotenv.config();

let workers: mediasoup.types.Worker[] = [];
let routers: { [id: string]: mediasoup.types.Router } = {};
let room: { [id: string]: { [username: string]: mediasoup.types.Transport } };
let stats: { [id: string]: number } = {}

async function createMeet(req: Request, res: Response, next: NextFunction) {
    // whenever first time meet is created
    // it checks for workers and creates new if workers are overloaded
    // and creates new router
    try {
        const id = generateRandomString(10)
        await createWorker()
        let minKey = null;
        if (workers.length > 0) {
            // get worker with the min routers
            let min = Infinity;
            for (let key in stats) {
                if (stats[key] < min) {
                    min = stats[key];
                    minKey = key;
                }
            }
        } else
            throw new Error("no workers found");

        const _worker = workers[Number(minKey) - 1];
        await createRouter(_worker, id);
        stats[minKey!] += 1;
        res.send(id);
    } catch (error) {
        console.log('error creating meet');
    }
}

function getRTPcapablities(id: string) {
    try {
        const router = routers[id]
        return router?.rtpCapabilities;
    } catch (error) {
        console.log('cannot get rtpcapablities');
    }
}

async function getLocalTransportParm(id: string) {
    try {
        const transportParams = await createLocalTransport(id!);
        const transport = {
            id: transportParams?.id,
            iceParameters: transportParams?.iceParameters,
            iceCandidates: transportParams?.iceCandidates,
            dtlsParameters: transportParams?.dtlsParameters,
            sctpParameters: transportParams?.sctpParameters
        };
        return transport;
    } catch (error) {
        console.log(error);
    }
}

async function createWorker() {
    if (workers.length < Number(process.env.MAX_WORKERS!)) {
        try {
            const worker = await mediasoup.createWorker({
                rtcMinPort: 2000,
                rtcMaxPort: 2020,
            })
            workers.push(worker);
            stats[String(workers.length)] = 0;

            console.log("new worker created successfully!");

            worker.on("died", (error) => {
                console.error("mediasoup worker has died");
                setTimeout(() => {
                    process.exit();
                }, 2000);
            });
        } catch (error) {
            console.error("Room not created: ", error);
        };
    }
}

async function createRouter(worker: mediasoup.types.Worker, id: string) {
    if (routers[id]) {
        return routers[id]
    }
    try {
        const router = await worker.createRouter({
            mediaCodecs: mediaCodecs,
        })
        console.log("router created")
        routers[id] = router;
        return router;
    } catch (error) { console.log("cannot create router") };
}

function getRouter(id: string) {
    return routers[id];
}

async function createLocalTransport(id: string) {
    try {
        const router = routers[id];
        const transport = await router.createWebRtcTransport({
            listenIps: [
                { ip: '0.0.0.0' }
            ],
            enableUdp: true,
            enableTcp: true,
        });
        console.log("local webRTCTransport created")
        return transport;
    } catch (error) {
        console.log(error);
    }
}

function generateRandomString(length: number): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz'; // characters to use
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
        if ((i + 1 === 3 || i + 1 === 6) && i + 1 !== length) {
            result += '-';
        }
    }
    return result;
}

export { createMeet, getRTPcapablities, getLocalTransportParm, getRouter, createLocalTransport };