export type ListenReqFun = (data: any, retry?: number) => void;

export type ResolutionUrls = { resolution: string, url: string; }[];

export type M3u8UrlData = { key: ArrayBuffer | null, urls: string[]; };

export type Progress = {
  update: (value: number) => void;
  updateLen: (value: number) => void;
  updateIndex: () => void;
  skip: () => void;
  err: () => void;
  end: () => void;
  downloaded: () => void;
};