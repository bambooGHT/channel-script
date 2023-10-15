import type { ResolutionUrls } from "../types";
import type { ListenReqFun } from "../types";
import { createDOM, createDivBox, progress } from "./create";
import { getResolutionUrls, getM3u8Data } from "../get";
import { initVideo } from "./Play";
import { download1 } from "../download";

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

export const videoPageDOM: ListenReqFun = (data: VideoStatus, token, retry = 0) => {
  if (document.querySelector("#downloadDOM")) return;

  return new Promise(async (res) => {
    let parentElement: any = document.querySelector("#video-page-wrapper")?.children[1];
    if (parentElement) {
      if (parentElement.querySelector(":scope>button")) parentElement = parentElement.children[2];
      const time = data.data.video_page.released_at.split(" ")[0];
      const title = `[${time}] ${document.title.replaceAll(":", ".")}.ts`.replace(/[<>/\\? \*]/g, "");
      const m3u8 = await getM3u8Data(token);
      addPageDOM(title, parentElement, m3u8);
      return;
    }

    if (retry++ > 5) return;

    setTimeout(() => {
      res(videoPageDOM(data, token, retry));
    }, 300);
  });
};

const addPageDOM = (title: string, parentElement: HTMLDivElement, m3u8Data: string) => {
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
    initVideo(m3u8Data, DOM);
  }));
  dom.appendChild(createDOM("下载1 (Chrome | edge | Opera)", async () => {
    if (isDown) {
      alert("已在下载中");
      return;
    }

    isDown = true;
    const p = progress(parentElement);

    try {
      await download1({ title, url: m3u8.urls[m3u8.currentIndex].url }, p.fn);
    } catch (error) {
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