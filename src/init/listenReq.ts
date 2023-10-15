import type { ListenReqFun } from "../types";

type Condition = {
  value: string;
  callback: ListenReqFun;
};

export const listenReq = (conditions: Condition[]) => {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  const setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

  const includesValue = conditions[0].value;
  let Authorization = "";

  XMLHttpRequest.prototype.setRequestHeader = function (hander, value) {
    if (this._url.includes(includesValue) && hander === "Authorization") {
      Authorization = value;
    }
    setRequestHeader.apply(this, arguments as any);
  };

  XMLHttpRequest.prototype.open = function (method, url: string) {
    this._url = url;
    originalOpen.apply(this, arguments as any);
  };

  XMLHttpRequest.prototype.send = function () {
    const { _url } = this;

    for (const item of conditions) {
      if (_url.includes(item.value)) {
        this.addEventListener('load', function () {
          window.apiPrefix = _url.split("fc/")[0];
          const data = JSON.parse(this.response);
          item.callback(data, Authorization);
        });
      }
    }

    originalSend.apply(this, arguments as any);
  };
};