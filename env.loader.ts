
process.env['DOTENV_CONFIG_QUIET'] = 'true';

import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';

const ENV = process.env['ENV']?.toLowerCase() ?? 'qa';

const allowedEnvironments = ['qa', 'uat', 'stg'];

if (!allowedEnvironments.includes(ENV)) {
    throw new Error(
        `Invalid ENV "${ENV}". Allowed values: ${allowedEnvironments.join(', ')}`
    );
}

const sharedEnvPath = path.resolve(
    __dirname,
    'profiles',
    `.env.${ENV}`
);

if (!fs.existsSync(sharedEnvPath)) {
    throw new Error(`Environment file not found: ${sharedEnvPath}`);
}

dotenv.config({
    path: sharedEnvPath,
    override: true,
    quiet: true,
});

const personalEnvPath = path.resolve(
    __dirname,
    'profiles',
    `.env.${ENV}.local`
);

if (fs.existsSync(personalEnvPath)) {
    dotenv.config({
        path: personalEnvPath,
        override: true,
        quiet: true,
    });
}

if (!process.env['BASE_URL']) {
    throw new Error(`BASE_URL is missing in environment profile "${ENV}"`);
}

export const currentEnv = ENV;
