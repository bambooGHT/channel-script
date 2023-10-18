import type { ListenReqFun } from "../types";

type Condition = {
  value: string;
  callback: ListenReqFun;
};

export const listenReq = (conditions: Condition[]) => {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  const originalSetItem = Storage.prototype.setItem;
  
  Storage.prototype.setItem = function (key, value) {
    if (key === "persist:auth") {
      window.Authorization = "Bearer " + JSON.parse(JSON.parse(value).totalUserInformation)["soyogisetune-asmr-plus"].userInformation.accessToken;
    }
    originalSetItem.call(this, key, value);
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
          if (!window.Authorization) return;

          window.apiPrefix = _url.split("fc/")[0];
          const data = JSON.parse(this.response);
          item.callback(data);
        });
      }
    }

    originalSend.apply(this, arguments as any);
  };
};