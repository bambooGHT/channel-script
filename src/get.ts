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
  const [url] = m3u8Data.match(/(?<=URI=")[^"]+(?=")/)!;
  return await (await fetch(url, {
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

export const formatTitle = (title: string) => {
  const value = (<HTMLDivElement>document.querySelectorAll(".MuiTypography-caption")[1]).innerText;
  return `[${value}] ${document.title.replaceAll(":", ".")}.ts`.replace(/[<>/\\? \*]/g, "");
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

export const getM3u8Data = async (id: string) => {
  const url = `${window.apiPrefix}fc/video_pages/${id}/session_ids`;

  const { data: { session_id } } = await req(url, "POST");

  const url2 = `https://hls-auth.cloud.stream.co.jp/auth/index.m3u8?session_id=${session_id}`;
  const m3u8Data = await (await fetch(url2)).text();

  return m3u8Data;
};

export const getM3u8HighUrl = async (id: string) => {
  const m3u8Data = await getM3u8Data(id);
  const urls = getResolutionUrls(m3u8Data);
  return urls[0].url;
};


export const processName = (time: string, title: string) => {
  return `[${time.split(" ")[0]}] ${title.replaceAll(":", ".")}.ts`.replace(/[<>/\\? \*]/g, "");
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

const req = async (url: string, method = "GET") => {
  const ops: ObjIndex = {
    method,
    headers: getHeaders(),
    credentials: 'include',
  };
  if (method === "POST") {
    ops.body = JSON.stringify({});
  }
  return (await fetch(url, ops)).json();
};

const getHeaders = () => {
  const headersData = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Fc_site_id': window.fcId,
    'Fc_use_device': 'null',
    Authorization: window.Authorization
  };
  return headersData;
};