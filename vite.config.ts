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
        version: "1.3.42",
        description: "修复批量下载,名稱相同會跳過下載的问题",
        author: "bambooGHT",
        match: [
          "https://canan8181.com/*",
          "https://rnqq.jp/*",
          "https://kemomimirefle.net/*",
          "https://nicochannel.jp/*",
          "https://yamingfc.net/*",
          "https://rizuna-official.com/*",
          "https://uise-official.com/*"
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
