import { clacSize } from "../get";

export const createDOM = (name: string, fun?: () => void) => {
  const DOM = `<div class="m1 m3 s1 s2">
      <span class="m2 m3">${name}</span>
  </div>`;

  let newElement = document.createElement("div");
  newElement.innerHTML = DOM;
  newElement = newElement.firstChild as any;
  newElement.onclick = fun || null;

  return newElement;
};

export const createDivBox = () => {
  const dom = document.createElement("div");
  dom.classList.add("flex1");
  return dom;
};

export const progress = (parentElement: HTMLDivElement) => {
  const firstElement = parentElement.children[1];
  const dom = createDOM("");
  dom.style.margin = "0 0 7px 0";
  dom.style.padding = "0 5px";

  parentElement.insertBefore(dom, firstElement);

  let i = 0;
  let size = 0;

  const remove = (time = 5500) => {
    setTimeout(() => {
      parentElement.removeChild(dom);
    }, time);
  };

  return {
    remove,
    fn: (len: number, isMultiple: boolean) => {
      dom.innerHTML = `下载中 0 / ${len} (0)`;

      const updateLen = (value: number) => {
        if (!isMultiple) len = value;
      };
      const update = (value: number) => {
        if (!isMultiple) i += 1;
        size += value;
        dom.innerHTML = `下载中 ${i} / ${len} (${clacSize(size)})`;
      };
      const updateIndex = () => {
        i += 1;
        update(0);
      };
      const skip = () => {
        --i;
        --len;
      };
      const err = () => {
        dom.innerHTML = `下载失败`;
        remove();
      };
      const downloaded = () => {
        dom.innerHTML = `下载完成 ${i} / ${len} (${clacSize(size)})`;
        remove();
      };
      const end = () => {
        if (!isMultiple) downloaded();
      };
      return {
        update,
        updateIndex,
        skip,
        err,
        end,
        downloaded,
        updateLen
      };
    }
  };
};
