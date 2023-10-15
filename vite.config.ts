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
        version: "1.0",
        description: "播放跟下载功能,有下载进度,后续会添加列表页面批量下载的功能",
        author: "bambooGHT",
        match: [
          "https://canan8181.com/*",
          "https://rnqq.jp/*",
          "https://kemomimirefle.net/*",
          "https://nicochannel.jp/*",
          "https://yamingfc.net/*"
        ],
        icon: "https://www.google.com/s2/favicons?sz=64&domain=nicochannel.jp",
        grant: "none",
        updateURL: "",
        downloadURL: ""
      },
      server: {
        open: false
      },
    }),
  ],
});
