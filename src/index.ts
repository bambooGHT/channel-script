import { style, script, listenReq } from "./init";
import { videoPageDOM } from "./initDOM";

style();
script();
listenReq([
  { value: "public_status", callback: videoPageDOM }
]);