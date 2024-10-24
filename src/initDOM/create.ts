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

export const createDivBox = (margin?: string) => {
  const dom = document.createElement("div");
  if (margin) dom.style.margin = margin;
  dom.classList.add("flex1");
  return dom;
};

export const progress = (parentElement: HTMLDivElement, len: number, isMultiple: boolean, margin: string, index = 1) => {
  const firstElement = parentElement.children[index];
  const dom = createDOM("");
  dom.style.margin =margin;
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
    fn: () => {
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

export const createInput = (type: string) => {
  const input = document.createElement("input");
  input.type = type;
  input.style.display = "block";
  input.style.position = "absolute";
  input.style.width = "19px";
  input.style.height = "19px";
  input.style.top = "0";
  input.style.right = "0";
  input.style.margin = "12px";
  input.style.zIndex = "1050";

  return input;
};