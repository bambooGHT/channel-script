import type { M3u8UrlData, Progress } from "../types";
import { getDownloadUrlListAndKey, getM3u8HighUrl } from "../get";
import { decrypt } from "./crypto";

enum RETRIES {
  MAX = 5
}
type DownlaodUrl = { title: string; url: string; };
type DownlaodUrl2 = { title: string; id: string; };
interface DOWNParam {
  (data: DownlaodUrl2[], progress: () => Progress, name: string): Promise<true | void>;
  (data: DownlaodUrl, progress: () => Progress, name?: string): Promise<true | void>;
}

export const download1: DOWNParam = async (data, progress, name) => {
  let dir = await showDirectoryPicker({ mode: "readwrite" });
  let updateProgress = progress();;

  const isExists = async (title: string) => {
    try {
      const fileHandle = await dir.getFileHandle(title);
      const file = await fileHandle.getFile();
      const fileSize = file.size;

      if (fileSize > 10240) {
        updateProgress.end();
        return true;
      }
      throw new Error('File size exceeds 5MB');
    } catch (error) {
      return false;
    }
  };

  const save = async (title: string, url: string) => {
    const file = await (await dir.getFileHandle(title, { create: true })).createWritable();
    const m3u8UrlData = await getDownloadUrlListAndKey(url);

    updateProgress.updateLen(m3u8UrlData.urls.length);
    const { stream } = await downloadStream(m3u8UrlData, updateProgress);

    await stream.pipeTo(file, { preventClose: true });
    return file.close();
  };

  if (!Array.isArray(data)) {
    return save(data.title, data.url);
  }

  dir = await getSaveDir(dir, name!);
  for (const item of data) {
    updateProgress.updateIndex();
    const is = await isExists(item.title);
    if (is) updateProgress.skip();
    else {
      const url = await getM3u8HighUrl(item.id);
      await save(item.title, url);
    }
  }
  updateProgress.downloaded();
};


const downloadStream = async (m3u8UrlData: M3u8UrlData, updateProgress: Progress) => {
  const { urls, key } = m3u8UrlData;
  const downAndDecryptFun = async (url: string, retryCount = 0): Promise<Uint8Array> => {
    try {
      const uint8Array = decrypt(await (await fetch(url)).arrayBuffer(), key);
      updateProgress.update(uint8Array.byteLength);
      return uint8Array;
    } catch (error) {
      if (retryCount > RETRIES.MAX) {
        updateProgress.err();
        alert("下载失败");
        throw Error("下载失败");
      }
      console.log(`下载失败 正在重试. url:${url}`);
      return downAndDecryptFun(url, retryCount + 1);
    }
  };

  const stream = new ReadableStream({
    async pull(controller) {
      if (!urls[0]) {
        controller.close();
        updateProgress.end();
        return;
      }

      const url = urls.splice(0, 6);
      let datas: Uint8Array[] | null = await Promise.all(url.map((URL) => downAndDecryptFun(URL)));
      datas.forEach((value) => controller.enqueue(value));
      datas = null;
      await this.pull!(controller);
    }
  });

  return { stream };
};

const getSaveDir = async (dir: FileSystemDirectoryHandle, name: string) => {
  const saveDir = await dir.getDirectoryHandle(name, { create: true });
  return saveDir;
};