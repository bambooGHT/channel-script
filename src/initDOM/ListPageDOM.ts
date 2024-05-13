import { downloadVideo } from "../download";
import { getList, processName } from "../get";
import { createDivBox, createDOM, createInput, progress } from "./create";

export const listPageDOM = (data: Data, retry = 0) => {
  const type = document.URL.split("/").at(-1)!.replace(/\?.*/, "");
  if (!data.data.video_pages.total || !["videos", "lives"].some(p => p === type)) return;

  const parentElement = document.querySelector(".MuiBox-root")!.children[1].children[0].children[0];
  const list = parentElement.querySelector(".infinite-scroll-component")?.children[0];

  if (parentElement && list) {
    updateListData(data.data.video_pages);
    let countDOM: HTMLDivElement = document.querySelector("#downloadCount")!;;
    if (!countDOM) {
      addPageDOM(parentElement as HTMLDivElement, type);
      countDOM = document.querySelector("#downloadCount")!.children[0] as HTMLDivElement;
      addListInputDOM(list as HTMLDivElement, countDOM, type);
    }

    return;
  }
  if (retry++ > 5) return;

  setTimeout(() => {
    listPageDOM(data, retry);
  }, 300);
};

const addPageDOM = (parentElement: HTMLDivElement, type: string) => {
  const margin = type === "lives" ? "0 0 0.4rem 0" : "0 0 0.4rem 0.75rem";
  const index = type === "lives" ? 2 : 1;
  const firstElement = parentElement.children[index];
  const tip = createDivBox(margin);
  const dom = createDivBox(type === "lives" ? "0" : "0 0 0 0.75rem");

  tip.appendChild(createDOM("默认下载最高画质,会跳过已下载的文件"));
  tip.appendChild(createDOM("点击查看支持浏览器", () => {
    window.open("https://caniuse.com/?search=showDirectoryPicker", "_blank");
  }));

  dom.appendChild(createDOM("下载", async () => {
    downloadHandler(parentElement, false, margin, index);
  }));

  dom.appendChild(createDOM("全部下载", async () => {
    if (Object.keys(listData.list).length !== listData.total) {
      const list = await getList(type, Math.ceil(listData.total / 100));
      updateListData({ list, total: listData.total });
    }

    downloadHandler(parentElement, true, margin, index);
  }));

  const countDOM = createDOM(`0 / ${listData.total}`);
  countDOM.id = "downloadCount";
  dom.appendChild(countDOM);

  parentElement.insertBefore(tip, firstElement);
  parentElement.insertBefore(dom, firstElement);
};

const addListInputDOM = (parentElement: HTMLDivElement, countDOM: HTMLDivElement, type: string) => {
  let i = 0;

  const addInputFun = (dom: HTMLDivElement) => {
    dom.style.position = "relative";
    const domClass = type === "lives" ? ".MuiTypography-subtitle2" : ".MuiTypography-colorTextPrimary";
    const textDOM = (<HTMLDivElement>dom.querySelector(domClass));

    const title = textDOM.innerText;
    const input = createInput("checkbox");
    if (type === "lives") input.style.margin = "0px 12px";

    input.onchange = () => {
      const url = (<HTMLImageElement>dom.querySelector("img")).src.split("&")[0];
      i += input.checked ? 1 : -1;
      listData.list[url + title].isDown = input.checked;
      countDOM.innerHTML = `${i} / ${listData.total}`;
    };
    dom.appendChild(input);
  };

  if (!parentElement.children[1]) parentElement = parentElement.parentElement! as HTMLDivElement;
  listenerDOMAdd(parentElement, addInputFun);
  const listDOM = Array.from(parentElement.children) as HTMLDivElement[];

  listDOM.forEach(p => addInputFun(p));
};

const listData: ListData = {
  list: {},
  total: 0
};

const updateListData = (data: Video_pages) => {
  data.list.reduce((result, value) => {
    const title = processName(value.released_at, value.title);
    result[value.thumbnail_url + value.title] = { title, id: value.content_code, isDown: false };

    return result;
  }, listData.list);
  listData.total = data.total;
};

let unObserverList = () => { };
let isDown = false;

const downloadHandler = async (dom: HTMLDivElement, isAll: boolean, margin: string, index: number) => {
  if (isDown) return;

  let list = Object.values(listData.list);
  if (!isAll) list = list.filter((p) => p.isDown);

  if (!list.length) {
    alert("尚未选择视频");
    return;
  }

  isDown = true;
  const p = progress(dom, list.length, true, margin, index);
  try {
    await downloadVideo(list, p.fn, document.title);
  } catch (error) {
    console.warn(error);
    p.remove();
  }

  isDown = false;
};

const listenerDOMAdd = (dom: HTMLDivElement, fun: Function) => {
  unObserverList();
  const observer = new MutationObserver(function (mutationRecoards, observer) {
    for (const item of mutationRecoards) {
      if (item.type === 'childList') {
        const DOM = item.addedNodes[0];
        fun(DOM);
      }
    }
  });

  unObserverList = () => {
    observer.disconnect();
  };
  observer.observe(dom, { childList: true });

  return observer;
};


type Data = {
  data: {
    video_pages: Video_pages;
  };
};

type Video_pages = {
  list: {
    content_code: string;
    display_date: string;
    live_finished_at: string;
    released_at: string;
    start_with_free_part_flg: boolean;
    thumbnail_url: string;
    title: string;
  }[],
  total: number;
};

type ListData = {
  list: ObjIndex<{
    title: string;
    id: string;
    isDown: boolean;
  }>;
  total: number;
};