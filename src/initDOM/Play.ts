export const initVideo = (m3u8Data: string, element: HTMLDivElement) => {
  if (element.querySelector("#myVideo")) return;

  const video = createVideo(element);
  const blob = new Blob([m3u8Data], { type: "application/x-mpegURL" });
  const url = URL.createObjectURL(blob);
  const player = videojs(video, {
    controlBar: {
      pictureInPictureToggle: true,
    },
    fluid: true,
    aspectRatio: "16:9",
    controls: true,
    autoplay: false,
    loop: false,
    preload: "auto",
    playbackRates: [0.5, 1, 1.5, 2, 2.5, 3],
    sources: [{
      src: url,
      type: "application/x-mpegURL"
    }],
    experimentalSvgIcons: true,
    disablepictureinpicture: false,
    bigPlayButton: true,
    pip: true,
    enableDocumentPictureInPicture: false,
  }, () => URL.revokeObjectURL(url));

  return player;
};
const createVideo = (element: HTMLDivElement) => {
  const tempVideo = `
  <video id="myVideo" class="video-js vjs-big-play-centered vjs-fluid">
    <p class="vjs-no-js">
      To view this video please enable JavaScript, and consider upgrading to a
      web browser that
      <a href="https://videojs.com/html5-video-support/" target="_blank">
        supports HTML5 video
      </a>
    </p>
  </video>`;
  element.innerHTML = tempVideo;

  return element.children[0];
};