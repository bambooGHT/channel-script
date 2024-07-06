import { style, script, listenReq } from "./init";
import { videoPageDOM, listPageDOM } from "./initDOM";

style();
script();
listenReq(["public_status", "video_pages", "live_pages"], [
  { value: "public_status", callback: videoPageDOM },
  { value: "video_pages", callback: listPageDOM },
  { value: "live_pages", callback: listPageDOM },
  {
    value: "content_providers", callback: (data: any) => {
      window.fcId = data.data.content_providers.id;
    }
  },
]);