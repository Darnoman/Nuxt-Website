import * as Global from "../../../components/Global";
import crypto from "crypto";
import https from "https";

function hmacSignature(key, msg) {
    return crypto.createHmac("sha256", key)
                 .update(msg)
                 .digest("base64");
}

function embedRequestQuery(apiKey, cardUuid, cssUrl, accountToken, targetOrigin = "") {
  const queryParams = {
    "token" : cardUuid,
    "css": cssUrl,
    "account_token": accountToken, // Only required if one or more end-users have been enrolled
    "target_origin": targetOrigin, // only required if you want to postMessage to the parent iframe
  }

  const embedRequestJson = JSON.stringify(queryParams, Object.keys(queryParams).sort());

  const embedRequest = Buffer.from(embedRequestJson).toString("base64");

  const embedRequestHmac = hmacSignature(apiKey, embedRequestJson);

  return {
    "embed_request": embedRequest,
    "hmac": embedRequestHmac
  };
}

function getEmbedHtml(apiKey, cardUuid, cssUrl, accountToken = null) {
  const params = embedRequestQuery(apiKey, cardUuid, cssUrl, accountToken);

  const options = {
    headers: {
      "Accept": "text/html",
      "Authorization": `api-key ${apiKey}`
    },   
    hostname: "api.lithic.com",
    method: "GET",
    port: 443,
    path: "/v1/embed/card?" + new URLSearchParams(params)
  };

  const req = https.get(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
  
    res.on("data", d => {
      /* HTML output */
      process.stdout.write(d);
    })
  })
  
  req.on("error", error => {
    console.error(error)
  })
  req.end();

  return req;
}


export default defineEventHandler(async (event) => {
    var body:any = await useBody(event);
    var cardUuid = body.cardUuid;
    var {embed_request, hmac} = embedRequestQuery(Global.apiKey, cardUuid, Global.cardCssUrl, "");
    return {
        embed_request,
        hmac
    }
});
