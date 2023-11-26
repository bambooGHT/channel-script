import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: "./src/index.ts",
      userscript: {
        name: "channelScript",
        namespace: "https://github.com/bambooGHT",
        version: "1.3.31",
        description: "修复了选不同分辨率播放失效的问题,添加了没有登录时的提示",
        author: "bambooGHT",
        match: [
          "https://canan8181.com/*",
          "https://rnqq.jp/*",
          "https://kemomimirefle.net/*",
          "https://nicochannel.jp/*",
          "https://yamingfc.net/*",
          "https://rizuna-official.com/*"
        ],
        icon: "https://www.google.com/s2/favicons?sz=64&domain=nicochannel.jp",
        grant: ["GM_xmlhttpRequest"],
        updateURL: "https://github.com/bambooGHT/channel-script/raw/main/dist/channelScript.user.js",
        downloadURL: "https://github.com/bambooGHT/channel-script/raw/main/dist/channelScript.user.js"
      },
      server: {
        open: false
      },
    }),
  ],
});
