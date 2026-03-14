#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
// Parse command line arguments
const mode = args[0] || 'local';
const configIndex = args.indexOf('--configuration');
const configPath = configIndex !== -1 && configIndex + 1 < args.length ? args[configIndex + 1] : null;
const debugLog = args.includes('--debug') || args.includes('-d');
// Set environment variable for configuration path if provided
if (configPath) {
    process.env.FIELD_CONFIG_PATH = configPath;
    console.error(`Using field configuration: ${configPath}`);
}
if( debugLog) {
    console.error('Debug mode enabled');
    process.env.DEBUG = 'true';
}
// Prepare arguments to pass to the spawned process (excluding --configuration args)
const argsWithoutMode = args.slice(1);
const childArgs = argsWithoutMode.filter((_, index) => {
    return index !== configIndex - 1 && index !== configIndex;});
    
function spawnAndWait(script: string, extraArgs: string[]) {
    const child = spawn('node', [script, ...extraArgs], {
        stdio: 'inherit',
        env: { ...process.env }
    });
    child.on('exit', (code) => process.exit(code ?? 0));
    child.on('error', (err) => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });
    // Forward signals to child
    for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP'] as const) {
        process.on(sig, () => child.kill(sig));
    }
}

if (mode === 'http') {
    spawnAndWait(join(__dirname, 'index-http.js'), childArgs);
} else if (mode === 'sse') {
    spawnAndWait(join(__dirname, 'index-sse-http.js'), childArgs);
} else {
    spawnAndWait(join(__dirname, 'index.js'), childArgs);
}