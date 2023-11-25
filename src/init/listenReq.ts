import { updateToken } from "../get";
import type { ListenReqFun } from "../types";

type Condition = {
  value: string;
  callback: ListenReqFun;
};

export const listenReq = (includesValue: string[], conditions: Condition[]) => {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  const setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

  XMLHttpRequest.prototype.setRequestHeader = function (hander, value) {
    if (includesValue.some(p => this._url.includes(p))) {
      if (hander === "Authorization") window.Authorization = value;
      if (hander === "Fc_site_id") window.fcId = value;
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
        this.addEventListener('load', async function () {
          if (window.isError) return;
          if (!window.Authorization) {
            await updateToken();
          }

          window.apiPrefix = _url.split("fc/")[0];
          const data = JSON.parse(this.response);
          item.callback(data);
        });
      }
    }

    originalSend.apply(this, arguments as any);
  };
};