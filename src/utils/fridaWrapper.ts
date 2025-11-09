
import { readFileSync } from 'fs';
import frida, { Message, Script, ScriptExports } from 'frida';
import adbkit, { Adb } from 'adbkit';

import { PINO } from '../constants';

const ADB = (adbkit as unknown as Adb).createClient();

let device: string;
let fridaAgent: ScriptExports;
let script: Script;
let isRestarting: boolean = false;

const getDevice = async () => {
    if (!device) return device = (await ADB.listDevices())[0].id;
    return device;
};

const openApp = async () => {
    try {
        await ADB.shell(
            await getDevice(),
            `monkey -p ${process.env.PACKAGE_NAME} -c android.intent.category.LAUNCHER 1`
        );
        PINO.info({ package: process.env.PACKAGE_NAME }, 'App opened');
    } catch (error) {
        PINO.error(error, 'Failed to open app');
    };
};

const loadJavaBridge = () => {
    const bridgeSrc = readFileSync('scripts/java.js', 'utf-8');
    return `(function() { ${bridgeSrc}; Object.defineProperty(globalThis, 'Java', { value: bridge }); })();\n`;
};

const sendPlayIntegrityHandler = (message: Message) => {
    if (message.type == 'send') {
        if (message.payload.token) {
            PINO.info({ token: message.payload.token }, 'Play Integrity Token received');
            process.env.PLAY_INTEGRITY_TOKEN = message.payload.token;
        } else if (message.payload.error) {
            PINO.error(message.payload.error, 'Failed to get Play Integrity Token');
        };
    };
};

export const connectAdb = async () => {
    try {
        const device = await getDevice();
        await ADB.shell(
            device,
            `su -c ${process.env.FRIDA_SERVER_PATH}`
        );
        PINO.info({ device }, 'Connected to ADB');
    } catch (error) {
        PINO.error(error, 'Failed to connect to ADB');
    };
};

export const loadFridaAgent = async () => {
    await openApp();
    try {
        const device = await frida.getUsbDevice();
        const session = await device.attach(process.env.PROCESS_NAME as string);
        script = await session.createScript(loadJavaBridge() + readFileSync('scripts/bypass.js', 'utf-8'));

        await script.load();
        PINO.info({ process: process.env.PROCESS_NAME }, 'Frida agent loaded');
        script.message.connect(sendPlayIntegrityHandler);
        fridaAgent = script.exports;
    } catch (error) {
        PINO.error(error, 'Failed to load frida agent');
    };
};

const processFridaCommand = async <T>(handler: () => Promise<T>): Promise<T | undefined> => {
    if (isRestarting || script.isDestroyed) {
        PINO.info('Restarting frida agent');
        isRestarting = true;
        await loadFridaAgent();
        isRestarting = false;
        return;
    };

    return await handler();
};

export const createKeyPair = async (userId: string): Promise<boolean | undefined> => {
    return await processFridaCommand<boolean>(async () => await fridaAgent.createKeyPair(`auth-keys-${userId}`));
};

export const deleteEntry = async (userId: string) => {
    return await processFridaCommand<boolean>(async () => await fridaAgent.deleteEntry(`auth-keys-${userId}`));
};

export const getCertificateChain = async (userId: string): Promise<string[] | undefined> => {
    return await processFridaCommand<string[]>(async () => await fridaAgent.getCertificateChain(`auth-keys-${userId}`));
};

export const signECDSA = async (data: string, userId: string): Promise<string | undefined> => {
    return await processFridaCommand<string>(async () => await fridaAgent.signECDSA(data, `auth-keys-${userId}`));
};

export const sendPlayIntegrityToken = async (): Promise<void> => {
    return await processFridaCommand(async () => await fridaAgent.sendPlayIntegrityToken());
};