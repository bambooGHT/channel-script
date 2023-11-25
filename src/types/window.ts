import VideoJs from "video.js";
declare global {
  const videojs: typeof VideoJs;
  const showDirectoryPicker: (value: any) => Promise<FileSystemDirectoryHandle>;
  interface XMLHttpRequest {
    _url: string;
  }
  interface Window {
    apiPrefix: string;
    Authorization: string;
    fcId: string;
    isError: boolean;
  }
}

export { };