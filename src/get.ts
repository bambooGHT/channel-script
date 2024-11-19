import type { ResolutionUrls } from "./types";

export const getDownloadUrlListAndKey = async (url: string) => {
  const data = await (await fetch(url)).text();
  const key = await getKey(data);
  const urls = data.replaceAll("\n", '').split(/#EXTINF:\d{1,3},/).slice(1);
  const urlListLast = urls[urls.length - 1];
  urls[urls.length - 1] = urlListLast.replace("#EXT-X-ENDLIST", '');
  return { urls, key };
};

export const getKey = async (m3u8Data: string) => {
  const url = m3u8Data.match(/(?<=URI=")[^"]+(?=")/)!;
  if (!url) return null;
  return await (await fetch(url[0], {
    headers: {
      Accept: "application/json, text/plain, */*"
    }
  })).arrayBuffer();
};

export const getResolutionUrls = (m3u8Data: string) => {
  const urlArray = m3u8Data.split("\n").filter(s => s.includes("https"));
  const RESOLUTIONS = m3u8Data.split("\n").filter(s => s.includes("RESOLUTION"));
  return RESOLUTIONS.reduce((result: ResolutionUrls, p, index) => {
    const [resolution] = p.match(/(?<=RESOLUTION=).*?(?=,)/)!;
    result.push({
      resolution,
      url: urlArray[index]
    });
    return result;
  }, []);
};

export const clacSize = (size: number) => {
  const aMultiples = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
  const bye = 1024;

  if (size < bye) return size + aMultiples[0];
  let i = 0;

  for (var l = 0; l < 8; l++) {
    if (size / Math.pow(bye, l) < 1) break;
    i = l;
  }

  return `${(size / Math.pow(bye, i)).toFixed(2)}${aMultiples[i]}`;
};

export const getM3u8Data = async (id: string, isAudio?: boolean) => {
  if (isAudio) return getM3u8DataToAudio(id);

  const url = `${window.apiPrefix}fc/video_pages/${id}/session_ids`;
  const { data: { session_id } } = await req(url, "POST");
  const url2 = `https://hls-auth.cloud.stream.co.jp/auth/index.m3u8?session_id=${session_id}`;
  const m3u8Data = await (await fetch(url2)).text();

  return m3u8Data;
};
const getM3u8DataToAudio = async (id: string) => {
  const { data: { resource } } = await req(`${window.apiPrefix}fc/video_pages/${id}/content_access`, "GET");
  return resource;
};

export const getM3u8HighUrl = async (id: string) => {
  const m3u8Data = await getM3u8Data(id);
  const urls = getResolutionUrls(m3u8Data);
  return urls[0].url;
};


export const processName = (time: string, title: string) => {
  return `[${time.split(" ")[0]}] ${title.replaceAll(":", ".")}.ts`.replace(/[^\x00-\x7F\u3000-\u30FF\uFF00-\uFFEF\u4E00-\u9FFF\u3040-\u309F\uAC00-\uD7AF]/g, "");
};

export const getList = async (type: string, len: number) => {
  const list: any[] = [];
  for (let index = 1; index <= len; index++) {
    const apiPrefix = `${window.apiPrefix}fc/fanclub_sites/${window.fcId}/`;
    const url = type === "lives" ? `${apiPrefix}live_pages?page=1&live_type=3&per_page=100`
      : `${apiPrefix}video_pages?vod_type=0&sort=-display_date&page=${index}&per_page=100`;
    const { data: { video_pages } } = await req(url);
    list.push(...video_pages.list);
  }
  return list;
};

const req = (url: string, method = "GET", r = 0): Promise<any> => {
  return new Promise(async (res) => {
    const ops: ObjIndex = {
      method,
      headers: getHeaders(),
      credentials: 'include',
    };
    if (method === "POST") {
      ops.body = JSON.stringify({});
    }
    fetch(url, ops)
      .then(async (data) => {
        if (!data.ok) {
          throw new Error("HTTP error: " + data.status);
        }
        res(data.json());
      })
      .catch(async (error) => {
        if (++r > 1) {
          console.error(error);
          return;
        }
        await updateToken();
        res(req(url, method, r));
      });
  });
};

export const getlocalToken = () => {
  const data = localStorage.getItem("persist:auth");
  if (data) {
    const userData = JSON.parse(JSON.parse(data).totalUserInformation).root;
    if (userData.userInformation?.accessToken) {
      window.Authorization = "Bearer " + userData.userInformation.accessToken;
    }
  }
};

const getUserInfo = () => {
  let fromData = `grant_type=refresh_token&redirect_uri=${document.location.origin}/login/login-redirect`;
  for (const item of Object.keys(localStorage).filter(p => p.startsWith("@@auth0spajs@@"))) {
    const value = localStorage.getItem(item)!;
    const { body } = JSON.parse(value);

    if (body) {
      fromData += `&client_id=${body.client_id}&refresh_token=${body.refresh_token}`;
      return fromData;
    }
  }
};

const getHeaders = () => {
  const headersData = {
    'Accept': 'application/json, text/plain, */*',
    'Fc_site_id': window.fcId || "16",
    'Fc_use_device': 'null',
    Authorization: window.Authorization,
    "Content-Type": "application/json;text/plain;charset=UTF-8"
  };
  return headersData;
};

export const updateToken = async () => {
  if (document.URL.includes("nicochannel")) {
    return updateToken1();
  }

  const url = "https://auth." + document.location.host + "/oauth/token";
  const data = getUserInfo();
  const req = await fetch(url, {
    "headers": {
      "accept": "*/*",
      "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6,zh-CN;q=0.5",
      "auth0-client": "eyJuYW1lIjoiYXV0aDAtc3BhLWpzIiwidmVyc2lvbiI6IjIuMC42In0=",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site"
    },
    "referrer": document.location.origin,
    "referrerPolicy": "strict-origin-when-cross-origin",
    "method": "POST",
    body: data,
    "mode": "cors",
    "credentials": "omit"
  });

  const resData = await req.json();
  if (resData.error?.message === "record not found") {
    console.error(resData);
    return;
  }

  window.Authorization = "Bearer " + resData.access_token;
};

const updateToken1 = async () => {
  const value = await fetch("https://api.nicochannel.jp/fc/fanclub_groups/1/auth/refresh", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6,zh-CN;q=0.5",
      "Authorization": window.Authorization,
      "fc_site_id": "16",
      "fc_use_device": "null",
      "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site"
    },
    "referrer": "https://nicochannel.jp/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });

  const resData = await value.json();

  if (resData?.data?.access_token) {
    window.Authorization = "Bearer " + resData.data.access_token;
  }
};