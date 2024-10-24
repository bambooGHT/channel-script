import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: "./src/index.ts",
      userscript: {
        name: "channel-script",
        namespace: "https://github.com/bambooGHT",
        version: "1.3.52",
        description: "改了一下判断逻辑",
        author: "bambooGHT",
        match: [
          "https://canan8181.com/*",
          "https://rnqq.jp/*",
          "https://kemomimirefle.net/*",
          "https://nicochannel.jp/*",
          "https://yamingfc.net/*",
          "https://rizuna-official.com/*",
          "https://uise-official.com/*",
          "https://tenshi-nano.com/*",
          "https://malice-kibana.com/*"
        ],
        icon: "https://www.google.com/s2/favicons?sz=64&domain=nicochannel.jp",
        updateURL: "https://github.com/bambooGHT/channel-script/raw/main/dist/channelScript.user.js",
        downloadURL: "https://github.com/bambooGHT/channel-script/raw/main/dist/channelScript.user.js"
      },
      server: {
        open: false
      },
    }),
  ],
});
