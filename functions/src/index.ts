import * as functions from 'firebase-functions';
import * as path from 'path';
const universal = require(path.resolve(__dirname, '../dist/vereador-website/server/main')).app();

export const ssr = functions.https.onRequest(universal);