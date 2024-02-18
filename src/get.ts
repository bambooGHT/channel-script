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
  return `[${time.split(" ")[0]}] ${title.replaceAll(":", ".")}.ts`.replace(/[/\\:?"<>|\*]/g, "");
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
          throw new Error("请求失败");
        }
        await updateToken();
        res(req(url, method, r));
      });
  });

};

const getHeaders = () => {
  const headersData = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Fc_site_id': window.fcId || "1",
    'Fc_use_device': 'null',
    Authorization: window.Authorization || "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICItUnRFd09TbFVCalFza0IzQWROdmdyZmRhZHllbm1reVF1SW96dG5hdno4In0.eyJleHAiOjE2OTc4MDkwNjQsImlhdCI6MTY5NzgwODc2NCwiYXV0aF90aW1lIjoxNjk3NDc2Mzc0LCJqdGkiOiI2NzcyNDA0Yy1jODY5LTQzZGYtOWFlMC01NjliYzNmZDM5ODgiLCJpc3MiOiJodHRwczovL2F1dGguc2hlZXRhLmNvbS9hdXRoL3JlYWxtcy9GQ1MwMDAwMSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIzODI0M2E1MC1kMjFlLTQzMzEtODBmZi04YTJkOGU3ZWJhMzkiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJGQ1MwMDI3NCIsInNlc3Npb25fc3RhdGUiOiJiOWFkN2Q4NS03NTk0LTRhYjAtYjYwNC1jYWFmYzdkODRhMTAiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1mY3MwMDAwMSIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsInNpZCI6ImI5YWQ3ZDg1LTc1OTQtNGFiMC1iNjA0LWNhYWZjN2Q4NGExMCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuaWNrbmFtZSI6IuOCsuOCueODiCIsInByZWZlcnJlZF91c2VybmFtZSI6Im5pY29uaWNvXzEyNTY0MjIwMSIsImVtYWlsIjoiMTgzOTc4MTU0NkBxcS5jb20ifQ.nhuIKwTYXgBa3pViSOmvQTJY3YOTBnebYuvX9RjyF8LQLSSS-s2lzU_yTfAfHr4rEcQXV3qHTNC6PLtHcoYK7QCz0SVZsFES6xDojjk04wC3_W06vIK7Gd259JcdeyKj_chRE0ZG_v4uakKV5I1PheH4IV2LsUqRnN8b7MVh08R_G6qL5ceGcd9GBG_-rTDS3pM0UFUClFcMiq6j1d8IVm95zfq9zx789No3vW-ob6l-KOuRsEsWq2MyiSm7DrFB9-K5Q0cxBcvCQXwDxoyYQSNhx5MbDWpa1rCuUt0P92Q6WicuBfXRmfamgmH8dGpt7PAy6ERAuyu1iBriZIRtwA"
  };
  return headersData;
};

export const updateToken = async () => {
  return new Promise((res) => {
    const ops: ObjIndex & { url: string; } = {
      method: "POST",
      url: "https://nfc-api.nicochannel.jp/fc/fanclub_groups/1/auth/refresh",
      data: JSON.stringify({}),
      headers: { "Cookie": document.cookie, ...getHeaders() },
      credentials: 'include',
      onload: async function (response: any) {
        const resData = JSON.parse(response.responseText);

        if (resData.error?.message === "record not found") {
          console.log(resData);
          await getToken1();
          res("ok");
          return;
        }

        window.Authorization = "Bearer " + resData.data.access_token;
        res("ok");
      }
    };
    GM_xmlhttpRequest(ops);
  });
};

const getToken1 = async () => {
  const value = await fetch("https://api.nicochannel.jp/fc/fanclub_groups/1/auth/refresh", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6,zh-CN;q=0.5",
      "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICItUnRFd09TbFVCalFza0IzQWROdmdyZmRhZHllbm1reVF1SW96dG5hdno4In0.eyJleHAiOjE3MDgyNDQ5ODIsImlhdCI6MTcwODI0NDY4MiwiYXV0aF90aW1lIjoxNzA4MjQzMDcyLCJqdGkiOiJmNjQzZGU4OS01MGFkLTQ2YTUtODUxYS0zZTIxMzdmYjk3NjgiLCJpc3MiOiJodHRwczovL2F1dGguc2hlZXRhLmNvbS9hdXRoL3JlYWxtcy9GQ1MwMDAwMSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIzODI0M2E1MC1kMjFlLTQzMzEtODBmZi04YTJkOGU3ZWJhMzkiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJGQ1MwMDAwMSIsInNlc3Npb25fc3RhdGUiOiJiNTJkYjQ4Ni00OWQyLTRkZDEtYTM2MS1kMWYwOGY3ZGQ1NzUiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1mY3MwMDAwMSIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsInNpZCI6ImI1MmRiNDg2LTQ5ZDItNGRkMS1hMzYxLWQxZjA4ZjdkZDU3NSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuaWNrbmFtZSI6IuOCsuOCueODiCIsInByZWZlcnJlZF91c2VybmFtZSI6Im5pY29uaWNvXzEyNTY0MjIwMSIsImVtYWlsIjoiMTgzOTc4MTU0NkBxcS5jb20ifQ.Je43rLH5R87icBa3VOamHyAaKeTHz7X_QrHjGtmoobNrtIDG9zbWWPRbxSKJRTaled5iWiUe_kXObR-yHRY1iCFdNERundVg_3IBbaQM5kAomxwInGRqHVqUFeI0TpZgtwczBX4YMxggsBb1Wm7SWmNT0_Z_tahZn6ft51Ir1HnvrmLP2Wjs5NxgEcerLB8S0K52UgaC4UA_ksuFiWg5m-_sgBS5ZmEEmI67shKMy_a5fIyjt_qHVtHmW-YA5Wv7cfnUHuR2Z85To7HaYJZhg9nTInGObkEPuZprP7v6mYrKQw2yeA1rA-aKZV6Fk5qv0EMhWK_hsFn2xPyf6pvDGw",
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
  if (resData.error?.message === "record not found") {
    window.isError = true;
    alert("使用脚本需要登录");
    throw Error("使用脚本需要登录");
  } else {
    window.Authorization = "Bearer " + resData.data.access_token;
  }
};