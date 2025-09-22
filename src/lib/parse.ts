import Parse from "parse/node";

let initialized = false;

/**
 * Initializes Parse with environment variables.
 *
 * Checks that PARSE_APP_ID, PARSE_JS_KEY, PARSE_SERVER_URL and PARSE_MASTER_KEY
 * are defined in the environment, and throws an error if any of them are
 * missing. If all the variables are defined, it initializes Parse with them and
 * sets a flag to prevent further initialization.
 *
 * @returns {Parse} The initialized Parse object.
 */
export function initParse() {
    if (!initialized) {
        const appId = process.env.PARSE_APP_ID;
        const jsKey = process.env.PARSE_JS_KEY;
        const serverURL = process.env.PARSE_SERVER_URL;
        const masterKey = process.env.PARSE_MASTER_KEY;

        if (!appId || !jsKey || !serverURL) {
            throw new Error(
                "Parse env vars missing: PARSE_APP_ID, PARSE_JS_KEY, PARSE_SERVER_URL",
            );
        }
        if (!masterKey) {
            // Many server-side operations here use useMasterKey; surface a clear error
            throw new Error("Parse env var missing: PARSE_MASTER_KEY");
        }

        // For Node SDK, pass masterKey as 3rd argument to enable useMasterKey operations
        Parse.initialize(appId, jsKey, masterKey);
        Parse.serverURL = serverURL;
        initialized = true;
    }
    return Parse;
}

export default Parse;
