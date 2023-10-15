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
  const urlArray = m3u8Data.split("\n").filter(s => s.includes("http")).slice(1);
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


const headersData = {
  'Accept': 'application/json, text/plain, */*',
  'Content-Type': 'application/json',
  'Fc_site_id': '1',
  'Fc_use_device': 'null',
};

export const getM3u8Data = async (token: string) => {
  const headers = {
    ...headersData,
    Authorization: token
  };

  const videoId = document.URL.split("video/")[1];
  const url = `${window.apiPrefix}fc/video_pages/${videoId}/session_ids`;

  const { data: { session_id } } = await (await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({}),
    credentials: 'include',
  })).json();

  const url2 = `https://hls-auth.cloud.stream.co.jp/auth/index.m3u8?session_id=${session_id}`;
  const m3u8Data = await (await fetch(url2)).text();

  return m3u8Data;
};