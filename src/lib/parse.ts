import Parse from "parse/node";

let initialized = false;

export function initParse() {
  if (!initialized) {
    const appId = process.env.PARSE_APP_ID;
    const jsKey = process.env.PARSE_JS_KEY;
    const serverURL = process.env.PARSE_SERVER_URL;

    if (!appId || !jsKey || !serverURL) {
      throw new Error("Parse env vars missing: PARSE_APP_ID, PARSE_JS_KEY, PARSE_SERVER_URL");
    }

    Parse.initialize(appId, jsKey);
    Parse.serverURL = serverURL;
    initialized = true;
  }
  return Parse;
}

export default Parse;
