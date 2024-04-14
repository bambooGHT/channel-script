import type { ResolutionUrls } from "../types";
import type { ListenReqFun } from "../types";
import { createDOM, createDivBox, progress } from "./create";
import { getResolutionUrls, getM3u8Data, processName } from "../get";
import { initVideo } from "./Play";
import { download1 } from "../download";

export const videoPageDOM: ListenReqFun = async (data: VideoStatus, retry = 0) => {
  let parentElement: any = document.querySelector("#video-page-wrapper")?.children[1];
  if (parentElement) {
    if (parentElement.querySelector(":scope>button")) parentElement = parentElement.children[2];

    const title = processName(data.data.video_page.released_at, document.title);
    let videoId = document.URL.split("video/")[1];
    if (!videoId) videoId = document.URL.split("live/")[1];

    const m3u8 = await getM3u8Data(videoId);
    addPageDOM(title, parentElement, m3u8);

    return;
  }
  if (retry++ > 5) return;

  setTimeout(() => {
    videoPageDOM(data, retry);
  }, 300);
};

const addPageDOM = (title: string, parentElement: HTMLDivElement, m3u8Data: string) => {
  if (document.querySelector("#downloadDOM")) return;
  const firstElement = parentElement.children[0];
  const dom = createDivBox();
  dom.id = "downloadDOM";

  let isDown = false;
  const m3u8: M3u8 = {
    currentIndex: 0,
    urls: getResolutionUrls(m3u8Data)
  };

  dom.appendChild(sharpnessSelectDOM(m3u8));
  dom.appendChild(createDOM("play", () => {
    const DOM = document.querySelector("#video-player-wrapper") as HTMLDivElement;
    initVideo(m3u8.urls[m3u8.currentIndex].url, DOM);
  }));
  dom.appendChild(createDOM("下载1 (Chrome | edge | Opera)", async () => {
    if (isDown) {
      alert("已在下载中");
      return;
    }

    isDown = true;
    const p = progress(parentElement, 0, false, "0 0 7px 0");

    try {
      await download1({ title, url: m3u8.urls[m3u8.currentIndex].url }, p.fn);
    } catch (error) {
      console.warn(error);
      p.remove(2000);
    }
    isDown = false;
  }));

  parentElement.insertBefore(dom, firstElement);
};

const sharpnessSelectDOM = (m3u8: M3u8) => {
  const select = document.createElement("select");
  select.classList.add("sharpnessSelect", "m1");

  select.innerHTML = m3u8.urls.reduce((result, value, index) => {
    const [left, right] = value.resolution.split("x");
    result += `<option value="${index}" ${index === 0 ? "selected" : ""}>
      ${right}p
    </option>`;
    return result;
  }, "");

  select.onchange = (e) => {
    m3u8.currentIndex = +(<HTMLInputElement>e.target!).value;
  };

  return select;
};

type VideoStatus = {
  data: {
    video_page: {
      closed_at: null;
      content_pf_unpublic_status: null;
      released_at: string;
      video_page_public_status: {
        display_name: string;
        id: number;
      };
    };
  };
};

type M3u8 = {
  currentIndex: number;
  urls: ResolutionUrls;
};