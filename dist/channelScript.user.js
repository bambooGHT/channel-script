// ==UserScript==
// @name         channelScript
// @namespace    https://github.com/bambooGHT
// @version      1.3.1
// @author       bambooGHT
// @description  修复个人域名请求没有token导致没有dom的问题,新增地址https://rizuna-official.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicochannel.jp
// @downloadURL  https://github.com/bambooGHT/channel-script/raw/main/dist/channelScript.user.js
// @updateURL    https://github.com/bambooGHT/channel-script/raw/main/dist/channelScript.user.js
// @match        https://canan8181.com/*
// @match        https://rnqq.jp/*
// @match        https://kemomimirefle.net/*
// @match        https://nicochannel.jp/*
// @match        https://yamingfc.net/*
// @match        https://rizuna-official.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  'use strict';

  const style = () => {
    const css = `
.dom-style {
  display: flex;
  flex-wrap: wrap;
  margin-top: -0.5rem;
  margin-bottom: 0.2rem;
}
.dom-style .dom-value > div {
  height: 24px;
  transition: .25s;
  background: #EFF0F4;
}
.dom-style .dom-value > div:active,
.dom-style .dom-value > div:hover {
  background: #ffb8b8;
}
input {
  display: none;
}
input:checked + label > div {
  background: #ffb8b8 !important;
}
.s1{
  background: linear-gradient(117.03deg, #139cb9 0%, #0ed9a8 100%);
  color: #FFFFFF;
  cursor: pointer;
}
.s2{
  display: block;
}
.m1{
  box-sizing: border-box;
  border: none;
  height: 24px;
  display: inline-flex;
  outline: 0;
  padding: 0;
  box-sizing: border-box;
  align-items: center;
  font-family: 'Roboto', 'Noto Sans JP', sans-serif;
  white-space: nowrap;
  border-radius: 16px;
  vertical-align: middle;
  justify-content: center;
  text-decoration: none;
}
.m2{
  font-size: 12px;
  line-height: 24px;
  padding-left: 8px;
  padding-right: 8px;
}
.m3{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.m4{
  color: rgba(0, 0, 0, 0.8);
}
.flex1 {
  margin-bottom: 0.4rem;
}
.flex1>div:not(:last-child) {
  margin-right: 7px;
}
.sharpnessSelect {
  background: linear-gradient(117.03deg, #139cb9 0%, #0ed9a8 100%);
  outline: 0;
  cursor: pointer;
  border: 0;
  color: white;
  padding: 0 0.2rem;
  margin-right: 7px;
}

.sharpnessSelect option {
  color: black;
}
`;
    const style2 = document.createElement("style");
    style2.innerHTML = css;
    document.head.appendChild(style2);
    const style1 = document.createElement("style");
    style1.innerHTML = `.vjs-svg-icon {
  display: inline-block;
  background-repeat: no-repeat;
  background-position: center;
  fill: #FFFFFF;
  height: 1.5em;
  width: 1.5em;
}
.vjs-svg-icon:before {
  content: none !important;
}

.vjs-svg-icon:hover,
.vjs-control:focus .vjs-svg-icon {
  filter: drop-shadow(0 0 0.25em #fff);
}

.vjs-modal-dialog .vjs-modal-dialog-content, .video-js .vjs-modal-dialog, .vjs-button > .vjs-icon-placeholder:before, .video-js .vjs-big-play-button .vjs-icon-placeholder:before {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.vjs-button > .vjs-icon-placeholder:before, .video-js .vjs-big-play-button .vjs-icon-placeholder:before {
  text-align: center;
}

@font-face {
  font-family: VideoJS;
  src: url(data:application/font-woff;charset=utf-8;base64,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) format("woff");
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-play, .video-js .vjs-play-control .vjs-icon-placeholder, .video-js .vjs-big-play-button .vjs-icon-placeholder:before {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-play:before, .video-js .vjs-play-control .vjs-icon-placeholder:before, .video-js .vjs-big-play-button .vjs-icon-placeholder:before {
  content: "\f101";
}

.vjs-icon-play-circle {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-play-circle:before {
  content: "\f102";
}

.vjs-icon-pause, .video-js .vjs-play-control.vjs-playing .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-pause:before, .video-js .vjs-play-control.vjs-playing .vjs-icon-placeholder:before {
  content: "\f103";
}

.vjs-icon-volume-mute, .video-js .vjs-mute-control.vjs-vol-0 .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-volume-mute:before, .video-js .vjs-mute-control.vjs-vol-0 .vjs-icon-placeholder:before {
  content: "\f104";
}

.vjs-icon-volume-low, .video-js .vjs-mute-control.vjs-vol-1 .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-volume-low:before, .video-js .vjs-mute-control.vjs-vol-1 .vjs-icon-placeholder:before {
  content: "\f105";
}

.vjs-icon-volume-mid, .video-js .vjs-mute-control.vjs-vol-2 .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-volume-mid:before, .video-js .vjs-mute-control.vjs-vol-2 .vjs-icon-placeholder:before {
  content: "\f106";
}

.vjs-icon-volume-high, .video-js .vjs-mute-control .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-volume-high:before, .video-js .vjs-mute-control .vjs-icon-placeholder:before {
  content: "\f107";
}

.vjs-icon-fullscreen-enter, .video-js .vjs-fullscreen-control .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-fullscreen-enter:before, .video-js .vjs-fullscreen-control .vjs-icon-placeholder:before {
  content: "\f108";
}

.vjs-icon-fullscreen-exit, .video-js.vjs-fullscreen .vjs-fullscreen-control .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-fullscreen-exit:before, .video-js.vjs-fullscreen .vjs-fullscreen-control .vjs-icon-placeholder:before {
  content: "\f109";
}

.vjs-icon-spinner {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-spinner:before {
  content: "\f10a";
}

.vjs-icon-subtitles, .video-js .vjs-subs-caps-button .vjs-icon-placeholder,
.video-js.video-js:lang(en-GB) .vjs-subs-caps-button .vjs-icon-placeholder,
.video-js.video-js:lang(en-IE) .vjs-subs-caps-button .vjs-icon-placeholder,
.video-js.video-js:lang(en-AU) .vjs-subs-caps-button .vjs-icon-placeholder,
.video-js.video-js:lang(en-NZ) .vjs-subs-caps-button .vjs-icon-placeholder, .video-js .vjs-subtitles-button .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-subtitles:before, .video-js .vjs-subs-caps-button .vjs-icon-placeholder:before,
.video-js.video-js:lang(en-GB) .vjs-subs-caps-button .vjs-icon-placeholder:before,
.video-js.video-js:lang(en-IE) .vjs-subs-caps-button .vjs-icon-placeholder:before,
.video-js.video-js:lang(en-AU) .vjs-subs-caps-button .vjs-icon-placeholder:before,
.video-js.video-js:lang(en-NZ) .vjs-subs-caps-button .vjs-icon-placeholder:before, .video-js .vjs-subtitles-button .vjs-icon-placeholder:before {
  content: "\f10b";
}

.vjs-icon-captions, .video-js:lang(en) .vjs-subs-caps-button .vjs-icon-placeholder,
.video-js:lang(fr-CA) .vjs-subs-caps-button .vjs-icon-placeholder, .video-js .vjs-captions-button .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-captions:before, .video-js:lang(en) .vjs-subs-caps-button .vjs-icon-placeholder:before,
.video-js:lang(fr-CA) .vjs-subs-caps-button .vjs-icon-placeholder:before, .video-js .vjs-captions-button .vjs-icon-placeholder:before {
  content: "\f10c";
}

.vjs-icon-hd {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-hd:before {
  content: "\f10d";
}

.vjs-icon-chapters, .video-js .vjs-chapters-button .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-chapters:before, .video-js .vjs-chapters-button .vjs-icon-placeholder:before {
  content: "\f10e";
}

.vjs-icon-downloading {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-downloading:before {
  content: "\f10f";
}

.vjs-icon-file-download {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-file-download:before {
  content: "\f110";
}

.vjs-icon-file-download-done {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-file-download-done:before {
  content: "\f111";
}

.vjs-icon-file-download-off {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-file-download-off:before {
  content: "\f112";
}

.vjs-icon-share {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-share:before {
  content: "\f113";
}

.vjs-icon-cog {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-cog:before {
  content: "\f114";
}

.vjs-icon-square {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-square:before {
  content: "\f115";
}

.vjs-icon-circle, .vjs-seek-to-live-control .vjs-icon-placeholder, .video-js .vjs-volume-level, .video-js .vjs-play-progress {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-circle:before, .vjs-seek-to-live-control .vjs-icon-placeholder:before, .video-js .vjs-volume-level:before, .video-js .vjs-play-progress:before {
  content: "\f116";
}

.vjs-icon-circle-outline {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-circle-outline:before {
  content: "\f117";
}

.vjs-icon-circle-inner-circle {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-circle-inner-circle:before {
  content: "\f118";
}

.vjs-icon-cancel, .video-js .vjs-control.vjs-close-button .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-cancel:before, .video-js .vjs-control.vjs-close-button .vjs-icon-placeholder:before {
  content: "\f119";
}

.vjs-icon-repeat {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-repeat:before {
  content: "\f11a";
}

.vjs-icon-replay, .video-js .vjs-play-control.vjs-ended .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-replay:before, .video-js .vjs-play-control.vjs-ended .vjs-icon-placeholder:before {
  content: "\f11b";
}

.vjs-icon-replay-5, .video-js .vjs-skip-backward-5 .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-replay-5:before, .video-js .vjs-skip-backward-5 .vjs-icon-placeholder:before {
  content: "\f11c";
}

.vjs-icon-replay-10, .video-js .vjs-skip-backward-10 .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-replay-10:before, .video-js .vjs-skip-backward-10 .vjs-icon-placeholder:before {
  content: "\f11d";
}

.vjs-icon-replay-30, .video-js .vjs-skip-backward-30 .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-replay-30:before, .video-js .vjs-skip-backward-30 .vjs-icon-placeholder:before {
  content: "\f11e";
}

.vjs-icon-forward-5, .video-js .vjs-skip-forward-5 .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-forward-5:before, .video-js .vjs-skip-forward-5 .vjs-icon-placeholder:before {
  content: "\f11f";
}

.vjs-icon-forward-10, .video-js .vjs-skip-forward-10 .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-forward-10:before, .video-js .vjs-skip-forward-10 .vjs-icon-placeholder:before {
  content: "\f120";
}

.vjs-icon-forward-30, .video-js .vjs-skip-forward-30 .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-forward-30:before, .video-js .vjs-skip-forward-30 .vjs-icon-placeholder:before {
  content: "\f121";
}

.vjs-icon-audio, .video-js .vjs-audio-button .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-audio:before, .video-js .vjs-audio-button .vjs-icon-placeholder:before {
  content: "\f122";
}

.vjs-icon-next-item {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-next-item:before {
  content: "\f123";
}

.vjs-icon-previous-item {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-previous-item:before {
  content: "\f124";
}

.vjs-icon-shuffle {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-shuffle:before {
  content: "\f125";
}

.vjs-icon-cast {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-cast:before {
  content: "\f126";
}

.vjs-icon-picture-in-picture-enter, .video-js .vjs-picture-in-picture-control .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-picture-in-picture-enter:before, .video-js .vjs-picture-in-picture-control .vjs-icon-placeholder:before {
  content: "\f127";
}

.vjs-icon-picture-in-picture-exit, .video-js.vjs-picture-in-picture .vjs-picture-in-picture-control .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-picture-in-picture-exit:before, .video-js.vjs-picture-in-picture .vjs-picture-in-picture-control .vjs-icon-placeholder:before {
  content: "\f128";
}

.vjs-icon-facebook {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-facebook:before {
  content: "\f129";
}

.vjs-icon-linkedin {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-linkedin:before {
  content: "\f12a";
}

.vjs-icon-twitter {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-twitter:before {
  content: "\f12b";
}

.vjs-icon-tumblr {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-tumblr:before {
  content: "\f12c";
}

.vjs-icon-pinterest {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-pinterest:before {
  content: "\f12d";
}

.vjs-icon-audio-description, .video-js .vjs-descriptions-button .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
}
.vjs-icon-audio-description:before, .video-js .vjs-descriptions-button .vjs-icon-placeholder:before {
  content: "\f12e";
}

.video-js {
  display: inline-block;
  vertical-align: top;
  box-sizing: border-box;
  color: #fff;
  background-color: #000;
  position: relative;
  padding: 0;
  font-size: 10px;
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  font-family: Arial, Helvetica, sans-serif;
  word-break: initial;
}
.video-js:-moz-full-screen {
  position: absolute;
}
.video-js:-webkit-full-screen {
  width: 100% !important;
  height: 100% !important;
}

.video-js[tabindex="-1"] {
  outline: none;
}

.video-js *,
.video-js *:before,
.video-js *:after {
  box-sizing: inherit;
}

.video-js ul {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  list-style-position: outside;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.video-js.vjs-fluid,
.video-js.vjs-16-9,
.video-js.vjs-4-3,
.video-js.vjs-9-16,
.video-js.vjs-1-1 {
  width: 100%;
  max-width: 100%;
}

.video-js.vjs-fluid:not(.vjs-audio-only-mode),
.video-js.vjs-16-9:not(.vjs-audio-only-mode),
.video-js.vjs-4-3:not(.vjs-audio-only-mode),
.video-js.vjs-9-16:not(.vjs-audio-only-mode),
.video-js.vjs-1-1:not(.vjs-audio-only-mode) {
  height: 0;
}

.video-js.vjs-16-9:not(.vjs-audio-only-mode) {
  padding-top: 56.25%;
}

.video-js.vjs-4-3:not(.vjs-audio-only-mode) {
  padding-top: 75%;
}

.video-js.vjs-9-16:not(.vjs-audio-only-mode) {
  padding-top: 177.7777777778%;
}

.video-js.vjs-1-1:not(.vjs-audio-only-mode) {
  padding-top: 100%;
}

.video-js.vjs-fill:not(.vjs-audio-only-mode) {
  width: 100%;
  height: 100%;
}

.video-js .vjs-tech {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-js.vjs-audio-only-mode .vjs-tech {
  display: none;
}

body.vjs-full-window,
body.vjs-pip-window {
  padding: 0;
  margin: 0;
  height: 100%;
}

.vjs-full-window .video-js.vjs-fullscreen,
body.vjs-pip-window .video-js {
  position: fixed;
  overflow: hidden;
  z-index: 1000;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}

.video-js.vjs-fullscreen:not(.vjs-ios-native-fs),
body.vjs-pip-window .video-js {
  width: 100% !important;
  height: 100% !important;
  padding-top: 0 !important;
  display: block;
}

.video-js.vjs-fullscreen.vjs-user-inactive {
  cursor: none;
}

.vjs-pip-container .vjs-pip-text {
  position: absolute;
  bottom: 10%;
  font-size: 2em;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0.5em;
  text-align: center;
  width: 100%;
}

.vjs-layout-tiny.vjs-pip-container .vjs-pip-text,
.vjs-layout-x-small.vjs-pip-container .vjs-pip-text,
.vjs-layout-small.vjs-pip-container .vjs-pip-text {
  bottom: 0;
  font-size: 1.4em;
}

.vjs-hidden {
  display: none !important;
}

.vjs-disabled {
  opacity: 0.5;
  cursor: default;
}

.video-js .vjs-offscreen {
  height: 1px;
  left: -9999px;
  position: absolute;
  top: 0;
  width: 1px;
}

.vjs-lock-showing {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.vjs-no-js {
  padding: 20px;
  color: #fff;
  background-color: #000;
  font-size: 18px;
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
  width: 300px;
  height: 150px;
  margin: 0px auto;
}

.vjs-no-js a,
.vjs-no-js a:visited {
  color: #66A8CC;
}

.video-js .vjs-big-play-button {
  font-size: 3em;
  line-height: 1.5em;
  height: 1.63332em;
  width: 3em;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 0;
  margin-top: -0.81666em;
  margin-left: -1.5em;
  cursor: pointer;
  opacity: 1;
  border: 0.06666em solid #fff;
  background-color: #2B333F;
  background-color: rgba(43, 51, 63, 0.7);
  border-radius: 0.3em;
  transition: all 0.4s;
}
.vjs-big-play-button .vjs-svg-icon {
  width: 0.75em;
  height: 0.75em;
}

.video-js:hover .vjs-big-play-button,
.video-js .vjs-big-play-button:focus {
  border-color: #fff;
  background-color: #73859f;
  background-color: rgba(115, 133, 159, 0.5);
  transition: all 0s;
}

.vjs-controls-disabled .vjs-big-play-button,
.vjs-has-started .vjs-big-play-button,
.vjs-using-native-controls .vjs-big-play-button,
.vjs-error .vjs-big-play-button {
  display: none;
}

.vjs-has-started.vjs-paused.vjs-show-big-play-button-on-pause .vjs-big-play-button {
  display: block;
}

.video-js button {
  background: none;
  border: none;
  color: inherit;
  display: inline-block;
  font-size: inherit;
  line-height: inherit;
  text-transform: none;
  text-decoration: none;
  transition: none;
  -webkit-appearance: none;
  -moz-appearance: none;
       appearance: none;
}

.vjs-control .vjs-button {
  width: 100%;
  height: 100%;
}

.video-js .vjs-control.vjs-close-button {
  cursor: pointer;
  height: 3em;
  position: absolute;
  right: 0;
  top: 0.5em;
  z-index: 2;
}
.video-js .vjs-modal-dialog {
  background: rgba(0, 0, 0, 0.8);
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8), rgba(255, 255, 255, 0));
  overflow: auto;
}

.video-js .vjs-modal-dialog > * {
  box-sizing: border-box;
}

.vjs-modal-dialog .vjs-modal-dialog-content {
  font-size: 1.2em;
  line-height: 1.5;
  padding: 20px 24px;
  z-index: 1;
}

.vjs-menu-button {
  cursor: pointer;
}

.vjs-menu-button.vjs-disabled {
  cursor: default;
}

.vjs-workinghover .vjs-menu-button.vjs-disabled:hover .vjs-menu {
  display: none;
}

.vjs-menu .vjs-menu-content {
  display: block;
  padding: 0;
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  overflow: auto;
}

.vjs-menu .vjs-menu-content > * {
  box-sizing: border-box;
}

.vjs-scrubbing .vjs-control.vjs-menu-button:hover .vjs-menu {
  display: none;
}

.vjs-menu li {
  display: flex;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0.2em 0;
  line-height: 1.4em;
  font-size: 1.2em;
  text-align: center;
  text-transform: lowercase;
}

.vjs-menu li.vjs-menu-item:focus,
.vjs-menu li.vjs-menu-item:hover,
.js-focus-visible .vjs-menu li.vjs-menu-item:hover {
  background-color: #73859f;
  background-color: rgba(115, 133, 159, 0.5);
}

.vjs-menu li.vjs-selected,
.vjs-menu li.vjs-selected:focus,
.vjs-menu li.vjs-selected:hover,
.js-focus-visible .vjs-menu li.vjs-selected:hover {
  background-color: #fff;
  color: #2B333F;
}
.vjs-menu li.vjs-selected .vjs-svg-icon,
.vjs-menu li.vjs-selected:focus .vjs-svg-icon,
.vjs-menu li.vjs-selected:hover .vjs-svg-icon,
.js-focus-visible .vjs-menu li.vjs-selected:hover .vjs-svg-icon {
  fill: #000000;
}

.video-js .vjs-menu *:not(.vjs-selected):focus:not(:focus-visible),
.js-focus-visible .vjs-menu *:not(.vjs-selected):focus:not(.focus-visible) {
  background: none;
}

.vjs-menu li.vjs-menu-title {
  text-align: center;
  text-transform: uppercase;
  font-size: 1em;
  line-height: 2em;
  padding: 0;
  margin: 0 0 0.3em 0;
  font-weight: bold;
  cursor: default;
}

.vjs-menu-button-popup .vjs-menu {
  display: none;
  position: absolute;
  bottom: 0;
  width: 10em;
  left: -3em;
  height: 0em;
  margin-bottom: 1.5em;
  border-top-color: rgba(43, 51, 63, 0.7);
}

.vjs-pip-window .vjs-menu-button-popup .vjs-menu {
  left: unset;
  right: 1em;
}

.vjs-menu-button-popup .vjs-menu .vjs-menu-content {
  background-color: #2B333F;
  background-color: rgba(43, 51, 63, 0.7);
  position: absolute;
  width: 100%;
  bottom: 1.5em;
  max-height: 15em;
}

.vjs-layout-tiny .vjs-menu-button-popup .vjs-menu .vjs-menu-content,
.vjs-layout-x-small .vjs-menu-button-popup .vjs-menu .vjs-menu-content {
  max-height: 5em;
}

.vjs-layout-small .vjs-menu-button-popup .vjs-menu .vjs-menu-content {
  max-height: 10em;
}

.vjs-layout-medium .vjs-menu-button-popup .vjs-menu .vjs-menu-content {
  max-height: 14em;
}

.vjs-layout-large .vjs-menu-button-popup .vjs-menu .vjs-menu-content,
.vjs-layout-x-large .vjs-menu-button-popup .vjs-menu .vjs-menu-content,
.vjs-layout-huge .vjs-menu-button-popup .vjs-menu .vjs-menu-content {
  max-height: 25em;
}

.vjs-workinghover .vjs-menu-button-popup.vjs-hover .vjs-menu,
.vjs-menu-button-popup .vjs-menu.vjs-lock-showing {
  display: block;
}

.video-js .vjs-menu-button-inline {
  transition: all 0.4s;
  overflow: hidden;
}

.video-js .vjs-menu-button-inline:before {
  width: 2.222222222em;
}

.video-js .vjs-menu-button-inline:hover,
.video-js .vjs-menu-button-inline:focus,
.video-js .vjs-menu-button-inline.vjs-slider-active {
  width: 12em;
}

.vjs-menu-button-inline .vjs-menu {
  opacity: 0;
  height: 100%;
  width: auto;
  position: absolute;
  left: 4em;
  top: 0;
  padding: 0;
  margin: 0;
  transition: all 0.4s;
}

.vjs-menu-button-inline:hover .vjs-menu,
.vjs-menu-button-inline:focus .vjs-menu,
.vjs-menu-button-inline.vjs-slider-active .vjs-menu {
  display: block;
  opacity: 1;
}

.vjs-menu-button-inline .vjs-menu-content {
  width: auto;
  height: 100%;
  margin: 0;
  overflow: hidden;
}

.video-js .vjs-control-bar {
  display: none;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3em;
  background-color: #2B333F;
  background-color: rgba(43, 51, 63, 0.7);
}

.vjs-has-started .vjs-control-bar,
.vjs-audio-only-mode .vjs-control-bar {
  display: flex;
  visibility: visible;
  opacity: 1;
  transition: visibility 0.1s, opacity 0.1s;
}

.vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar {
  visibility: visible;
  opacity: 0;
  pointer-events: none;
  transition: visibility 1s, opacity 1s;
}

.vjs-controls-disabled .vjs-control-bar,
.vjs-using-native-controls .vjs-control-bar,
.vjs-error .vjs-control-bar {
  display: none !important;
}

.vjs-audio.vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar,
.vjs-audio-only-mode.vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.video-js .vjs-control {
  position: relative;
  text-align: center;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 4em;
  flex: none;
}

.video-js .vjs-control.vjs-visible-text {
  width: auto;
  padding-left: 1em;
  padding-right: 1em;
}

.vjs-button > .vjs-icon-placeholder:before {
  font-size: 1.8em;
  line-height: 1.67;
}

.vjs-button > .vjs-icon-placeholder {
  display: block;
}

.vjs-button > .vjs-svg-icon {
  display: inline-block;
}

.video-js .vjs-control:focus:before,
.video-js .vjs-control:hover:before,
.video-js .vjs-control:focus {
  text-shadow: 0em 0em 1em white;
}

.video-js *:not(.vjs-visible-text) > .vjs-control-text {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

.video-js .vjs-custom-control-spacer {
  display: none;
}

.video-js .vjs-progress-control {
  cursor: pointer;
  flex: auto;
  display: flex;
  align-items: center;
  min-width: 4em;
  touch-action: none;
}

.video-js .vjs-progress-control.disabled {
  cursor: default;
}

.vjs-live .vjs-progress-control {
  display: none;
}

.vjs-liveui .vjs-progress-control {
  display: flex;
  align-items: center;
}

.video-js .vjs-progress-holder {
  flex: auto;
  transition: all 0.2s;
  height: 0.3em;
}

.video-js .vjs-progress-control .vjs-progress-holder {
  margin: 0 10px;
}

.video-js .vjs-progress-control:hover .vjs-progress-holder {
  font-size: 1.6666666667em;
}

.video-js .vjs-progress-control:hover .vjs-progress-holder.disabled {
  font-size: 1em;
}

.video-js .vjs-progress-holder .vjs-play-progress,
.video-js .vjs-progress-holder .vjs-load-progress,
.video-js .vjs-progress-holder .vjs-load-progress div {
  position: absolute;
  display: block;
  height: 100%;
  margin: 0;
  padding: 0;
  width: 0;
}

.video-js .vjs-play-progress {
  background-color: #fff;
}
.video-js .vjs-play-progress:before {
  font-size: 0.9em;
  position: absolute;
  right: -0.5em;
  line-height: 0.35em;
  z-index: 1;
}

.vjs-svg-icons-enabled .vjs-play-progress:before {
  content: none !important;
}

.vjs-play-progress .vjs-svg-icon {
  position: absolute;
  top: -0.35em;
  right: -0.4em;
  width: 1em;
  height: 1em;
  pointer-events: none;
  line-height: 0.15em;
  z-index: 1;
}

.video-js .vjs-load-progress {
  background: rgba(115, 133, 159, 0.5);
}

.video-js .vjs-load-progress div {
  background: rgba(115, 133, 159, 0.75);
}

.video-js .vjs-time-tooltip {
  background-color: #fff;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0.3em;
  color: #000;
  float: right;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1em;
  padding: 6px 8px 8px 8px;
  pointer-events: none;
  position: absolute;
  top: -3.4em;
  visibility: hidden;
  z-index: 1;
}

.vjs-progress-control:hover .vjs-progress-holder .vjs-play-progress .vjs-svg-icon {
  width: 0.8em;
  height: 0.8em;
  top: -0.25em;
  right: -0.5em;
  line-height: 0.35em;
}

.video-js .vjs-progress-holder:focus .vjs-time-tooltip {
  display: none;
}

.video-js .vjs-progress-control:hover .vjs-time-tooltip,
.video-js .vjs-progress-control:hover .vjs-progress-holder:focus .vjs-time-tooltip {
  display: block;
  font-size: 0.6em;
  visibility: visible;
}

.video-js .vjs-progress-control.disabled:hover .vjs-time-tooltip {
  font-size: 1em;
}

.video-js .vjs-progress-control .vjs-mouse-display {
  display: none;
  position: absolute;
  width: 1px;
  height: 100%;
  background-color: #000;
  z-index: 1;
}

.video-js .vjs-progress-control:hover .vjs-mouse-display {
  display: block;
}

.video-js.vjs-user-inactive .vjs-progress-control .vjs-mouse-display {
  visibility: hidden;
  opacity: 0;
  transition: visibility 1s, opacity 1s;
}

.vjs-mouse-display .vjs-time-tooltip {
  color: #fff;
  background-color: #000;
  background-color: rgba(0, 0, 0, 0.8);
}

.video-js .vjs-slider {
  position: relative;
  cursor: pointer;
  padding: 0;
  margin: 0 0.45em 0 0.45em;
  /* iOS Safari */
  -webkit-touch-callout: none;
  /* Safari, and Chrome 53 */
  -webkit-user-select: none;
  /* Non-prefixed version, currently supported by Chrome and Opera */
  -moz-user-select: none;
       user-select: none;
  background-color: #73859f;
  background-color: rgba(115, 133, 159, 0.5);
}

.video-js .vjs-slider.disabled {
  cursor: default;
}

.video-js .vjs-slider:focus {
  text-shadow: 0em 0em 1em white;
  box-shadow: 0 0 1em #fff;
}

.video-js .vjs-mute-control {
  cursor: pointer;
  flex: none;
}
.video-js .vjs-volume-control {
  cursor: pointer;
  margin-right: 1em;
  display: flex;
}

.video-js .vjs-volume-control.vjs-volume-horizontal {
  width: 5em;
}

.video-js .vjs-volume-panel .vjs-volume-control {
  visibility: visible;
  opacity: 0;
  width: 1px;
  height: 1px;
  margin-left: -1px;
}

.video-js .vjs-volume-panel {
  transition: width 1s;
}
.video-js .vjs-volume-panel.vjs-hover .vjs-volume-control, .video-js .vjs-volume-panel:active .vjs-volume-control, .video-js .vjs-volume-panel:focus .vjs-volume-control, .video-js .vjs-volume-panel .vjs-volume-control:active, .video-js .vjs-volume-panel.vjs-hover .vjs-mute-control ~ .vjs-volume-control, .video-js .vjs-volume-panel .vjs-volume-control.vjs-slider-active {
  visibility: visible;
  opacity: 1;
  position: relative;
  transition: visibility 0.1s, opacity 0.1s, height 0.1s, width 0.1s, left 0s, top 0s;
}
.video-js .vjs-volume-panel.vjs-hover .vjs-volume-control.vjs-volume-horizontal, .video-js .vjs-volume-panel:active .vjs-volume-control.vjs-volume-horizontal, .video-js .vjs-volume-panel:focus .vjs-volume-control.vjs-volume-horizontal, .video-js .vjs-volume-panel .vjs-volume-control:active.vjs-volume-horizontal, .video-js .vjs-volume-panel.vjs-hover .vjs-mute-control ~ .vjs-volume-control.vjs-volume-horizontal, .video-js .vjs-volume-panel .vjs-volume-control.vjs-slider-active.vjs-volume-horizontal {
  width: 5em;
  height: 3em;
  margin-right: 0;
}
.video-js .vjs-volume-panel.vjs-hover .vjs-volume-control.vjs-volume-vertical, .video-js .vjs-volume-panel:active .vjs-volume-control.vjs-volume-vertical, .video-js .vjs-volume-panel:focus .vjs-volume-control.vjs-volume-vertical, .video-js .vjs-volume-panel .vjs-volume-control:active.vjs-volume-vertical, .video-js .vjs-volume-panel.vjs-hover .vjs-mute-control ~ .vjs-volume-control.vjs-volume-vertical, .video-js .vjs-volume-panel .vjs-volume-control.vjs-slider-active.vjs-volume-vertical {
  left: -3.5em;
  transition: left 0s;
}
.video-js .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-hover, .video-js .vjs-volume-panel.vjs-volume-panel-horizontal:active, .video-js .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-slider-active {
  width: 10em;
  transition: width 0.1s;
}
.video-js .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-mute-toggle-only {
  width: 4em;
}

.video-js .vjs-volume-panel .vjs-volume-control.vjs-volume-vertical {
  height: 8em;
  width: 3em;
  left: -3000em;
  transition: visibility 1s, opacity 1s, height 1s 1s, width 1s 1s, left 1s 1s, top 1s 1s;
}

.video-js .vjs-volume-panel .vjs-volume-control.vjs-volume-horizontal {
  transition: visibility 1s, opacity 1s, height 1s 1s, width 1s, left 1s 1s, top 1s 1s;
}

.video-js .vjs-volume-panel {
  display: flex;
}

.video-js .vjs-volume-bar {
  margin: 1.35em 0.45em;
}

.vjs-volume-bar.vjs-slider-horizontal {
  width: 5em;
  height: 0.3em;
}

.vjs-volume-bar.vjs-slider-vertical {
  width: 0.3em;
  height: 5em;
  margin: 1.35em auto;
}

.video-js .vjs-volume-level {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #fff;
}
.video-js .vjs-volume-level:before {
  position: absolute;
  font-size: 0.9em;
  z-index: 1;
}

.vjs-slider-vertical .vjs-volume-level {
  width: 0.3em;
}
.vjs-slider-vertical .vjs-volume-level:before {
  top: -0.5em;
  left: -0.3em;
  z-index: 1;
}

.vjs-svg-icons-enabled .vjs-volume-level:before {
  content: none;
}

.vjs-volume-level .vjs-svg-icon {
  position: absolute;
  width: 0.6em;
  height: 0.6em;
  top: -0.55em;
  pointer-events: none;
}

.vjs-mute-control .vjs-svg-icon {
  width: 1.75em;
  height: 1.75em;
}

.vjs-slider-horizontal .vjs-volume-level {
  height: 0.3em;
}
.vjs-slider-horizontal .vjs-volume-level:before {
  line-height: 0.35em;
  right: -0.5em;
}

.vjs-slider-horizontal .vjs-volume-level .vjs-svg-icon {
  top: -0.15em;
  right: -0.3em;
  line-height: 0.05em;
}

.vjs-slider-vertical .vjs-volume-level .vjs-svg-icon {
  top: -0.9em;
  right: -0.15em;
}

.video-js .vjs-volume-panel.vjs-volume-panel-vertical {
  width: 4em;
}

.vjs-volume-bar.vjs-slider-vertical .vjs-volume-level {
  height: 100%;
}

.vjs-volume-bar.vjs-slider-horizontal .vjs-volume-level {
  width: 100%;
}

.video-js .vjs-volume-vertical {
  width: 3em;
  height: 8em;
  bottom: 8em;
  background-color: #2B333F;
  background-color: rgba(43, 51, 63, 0.7);
}

.video-js .vjs-volume-horizontal .vjs-menu {
  left: -2em;
}

.video-js .vjs-volume-tooltip {
  background-color: #fff;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0.3em;
  color: #000;
  float: right;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1em;
  padding: 6px 8px 8px 8px;
  pointer-events: none;
  position: absolute;
  top: -3.4em;
  visibility: hidden;
  z-index: 1;
}

.video-js .vjs-volume-control:hover .vjs-volume-tooltip,
.video-js .vjs-volume-control:hover .vjs-progress-holder:focus .vjs-volume-tooltip {
  display: block;
  font-size: 1em;
  visibility: visible;
}

.video-js .vjs-volume-vertical:hover .vjs-volume-tooltip,
.video-js .vjs-volume-vertical:hover .vjs-progress-holder:focus .vjs-volume-tooltip {
  left: 1em;
  top: -12px;
}

.video-js .vjs-volume-control.disabled:hover .vjs-volume-tooltip {
  font-size: 1em;
}

.video-js .vjs-volume-control .vjs-mouse-display {
  display: none;
  position: absolute;
  width: 100%;
  height: 1px;
  background-color: #000;
  z-index: 1;
}

.video-js .vjs-volume-horizontal .vjs-mouse-display {
  width: 1px;
  height: 100%;
}

.video-js .vjs-volume-control:hover .vjs-mouse-display {
  display: block;
}

.video-js.vjs-user-inactive .vjs-volume-control .vjs-mouse-display {
  visibility: hidden;
  opacity: 0;
  transition: visibility 1s, opacity 1s;
}

.vjs-mouse-display .vjs-volume-tooltip {
  color: #fff;
  background-color: #000;
  background-color: rgba(0, 0, 0, 0.8);
}

.vjs-poster {
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
}

.vjs-has-started .vjs-poster,
.vjs-using-native-controls .vjs-poster {
  display: none;
}

.vjs-audio.vjs-has-started .vjs-poster,
.vjs-has-started.vjs-audio-poster-mode .vjs-poster,
.vjs-pip-container.vjs-has-started .vjs-poster {
  display: block;
}

.vjs-poster img {
  width: 100%;
  height: 100%;
  -o-object-fit: contain;
     object-fit: contain;
}

.video-js .vjs-live-control {
  display: flex;
  align-items: flex-start;
  flex: auto;
  font-size: 1em;
  line-height: 3em;
}

.video-js:not(.vjs-live) .vjs-live-control,
.video-js.vjs-liveui .vjs-live-control {
  display: none;
}

.video-js .vjs-seek-to-live-control {
  align-items: center;
  cursor: pointer;
  flex: none;
  display: inline-flex;
  height: 100%;
  padding-left: 0.5em;
  padding-right: 0.5em;
  font-size: 1em;
  line-height: 3em;
  width: auto;
  min-width: 4em;
}

.video-js.vjs-live:not(.vjs-liveui) .vjs-seek-to-live-control,
.video-js:not(.vjs-live) .vjs-seek-to-live-control {
  display: none;
}

.vjs-seek-to-live-control.vjs-control.vjs-at-live-edge {
  cursor: auto;
}

.vjs-seek-to-live-control .vjs-icon-placeholder {
  margin-right: 0.5em;
  color: #888;
}

.vjs-svg-icons-enabled .vjs-seek-to-live-control {
  line-height: 0;
}

.vjs-seek-to-live-control .vjs-svg-icon {
  width: 1em;
  height: 1em;
  pointer-events: none;
  fill: #888888;
}

.vjs-seek-to-live-control.vjs-control.vjs-at-live-edge .vjs-icon-placeholder {
  color: red;
}

.vjs-seek-to-live-control.vjs-control.vjs-at-live-edge .vjs-svg-icon {
  fill: red;
}

.video-js .vjs-time-control {
  flex: none;
  font-size: 1em;
  line-height: 3em;
  min-width: 2em;
  width: auto;
  padding-left: 1em;
  padding-right: 1em;
}

.vjs-live .vjs-time-control,
.vjs-live .vjs-time-divider,
.video-js .vjs-current-time,
.video-js .vjs-duration {
  display: none;
}

.vjs-time-divider {
  display: none;
  line-height: 3em;
}

.video-js .vjs-play-control {
  cursor: pointer;
}

.video-js .vjs-play-control .vjs-icon-placeholder {
  flex: none;
}

.vjs-text-track-display {
  position: absolute;
  bottom: 3em;
  left: 0;
  right: 0;
  top: 0;
  pointer-events: none;
}

.video-js.vjs-controls-disabled .vjs-text-track-display,
.video-js.vjs-user-inactive.vjs-playing .vjs-text-track-display {
  bottom: 1em;
}

.video-js .vjs-text-track {
  font-size: 1.4em;
  text-align: center;
  margin-bottom: 0.1em;
}

.vjs-subtitles {
  color: #fff;
}

.vjs-captions {
  color: #fc6;
}

.vjs-tt-cue {
  display: block;
}

video::-webkit-media-text-track-display {
  transform: translateY(-3em);
}

.video-js.vjs-controls-disabled video::-webkit-media-text-track-display,
.video-js.vjs-user-inactive.vjs-playing video::-webkit-media-text-track-display {
  transform: translateY(-1.5em);
}

.video-js .vjs-picture-in-picture-control {
  cursor: pointer;
  flex: none;
}
.video-js.vjs-audio-only-mode .vjs-picture-in-picture-control,
.vjs-pip-window .vjs-picture-in-picture-control {
  display: none;
}

.video-js .vjs-fullscreen-control {
  cursor: pointer;
  flex: none;
}
.video-js.vjs-audio-only-mode .vjs-fullscreen-control,
.vjs-pip-window .vjs-fullscreen-control {
  display: none;
}

.vjs-playback-rate > .vjs-menu-button,
.vjs-playback-rate .vjs-playback-rate-value {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.vjs-playback-rate .vjs-playback-rate-value {
  pointer-events: none;
  font-size: 1.5em;
  line-height: 2;
  text-align: center;
}

.vjs-playback-rate .vjs-menu {
  width: 4em;
  left: 0em;
}

.vjs-error .vjs-error-display .vjs-modal-dialog-content {
  font-size: 1.4em;
  text-align: center;
}

.vjs-error .vjs-error-display:before {
  color: #fff;
  content: "X";
  font-family: Arial, Helvetica, sans-serif;
  font-size: 4em;
  left: 0;
  line-height: 1;
  margin-top: -0.5em;
  position: absolute;
  text-shadow: 0.05em 0.05em 0.1em #000;
  text-align: center;
  top: 50%;
  vertical-align: middle;
  width: 100%;
}

.vjs-loading-spinner {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.85;
  text-align: left;
  border: 0.6em solid rgba(43, 51, 63, 0.7);
  box-sizing: border-box;
  background-clip: padding-box;
  width: 5em;
  height: 5em;
  border-radius: 50%;
  visibility: hidden;
}

.vjs-seeking .vjs-loading-spinner,
.vjs-waiting .vjs-loading-spinner {
  display: block;
  animation: vjs-spinner-show 0s linear 0.3s forwards;
}

.vjs-loading-spinner:before,
.vjs-loading-spinner:after {
  content: "";
  position: absolute;
  margin: -0.6em;
  box-sizing: inherit;
  width: inherit;
  height: inherit;
  border-radius: inherit;
  opacity: 1;
  border: inherit;
  border-color: transparent;
  border-top-color: white;
}

.vjs-seeking .vjs-loading-spinner:before,
.vjs-seeking .vjs-loading-spinner:after,
.vjs-waiting .vjs-loading-spinner:before,
.vjs-waiting .vjs-loading-spinner:after {
  animation: vjs-spinner-spin 1.1s cubic-bezier(0.6, 0.2, 0, 0.8) infinite, vjs-spinner-fade 1.1s linear infinite;
}

.vjs-seeking .vjs-loading-spinner:before,
.vjs-waiting .vjs-loading-spinner:before {
  border-top-color: rgb(255, 255, 255);
}

.vjs-seeking .vjs-loading-spinner:after,
.vjs-waiting .vjs-loading-spinner:after {
  border-top-color: rgb(255, 255, 255);
  animation-delay: 0.44s;
}

@keyframes vjs-spinner-show {
  to {
    visibility: visible;
  }
}
@keyframes vjs-spinner-spin {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes vjs-spinner-fade {
  0% {
    border-top-color: #73859f;
  }
  20% {
    border-top-color: #73859f;
  }
  35% {
    border-top-color: white;
  }
  60% {
    border-top-color: #73859f;
  }
  100% {
    border-top-color: #73859f;
  }
}
.video-js.vjs-audio-only-mode .vjs-captions-button {
  display: none;
}

.vjs-chapters-button .vjs-menu ul {
  width: 24em;
}

.video-js.vjs-audio-only-mode .vjs-descriptions-button {
  display: none;
}

.vjs-subs-caps-button + .vjs-menu .vjs-captions-menu-item .vjs-svg-icon {
  margin-left: 0.3em;
}

.video-js .vjs-subs-caps-button + .vjs-menu .vjs-captions-menu-item .vjs-menu-item-text .vjs-icon-placeholder {
  vertical-align: middle;
  display: inline-block;
  margin-bottom: -0.1em;
}

.video-js .vjs-subs-caps-button + .vjs-menu .vjs-captions-menu-item .vjs-menu-item-text .vjs-icon-placeholder:before {
  font-family: VideoJS;
  content: "\f10c";
  font-size: 1.5em;
  line-height: inherit;
}

.video-js.vjs-audio-only-mode .vjs-subs-caps-button {
  display: none;
}

.video-js .vjs-audio-button + .vjs-menu .vjs-description-menu-item .vjs-menu-item-text .vjs-icon-placeholder,
.video-js .vjs-audio-button + .vjs-menu .vjs-main-desc-menu-item .vjs-menu-item-text .vjs-icon-placeholder {
  vertical-align: middle;
  display: inline-block;
  margin-bottom: -0.1em;
}

.video-js .vjs-audio-button + .vjs-menu .vjs-description-menu-item .vjs-menu-item-text .vjs-icon-placeholder:before,
.video-js .vjs-audio-button + .vjs-menu .vjs-main-desc-menu-item .vjs-menu-item-text .vjs-icon-placeholder:before {
  font-family: VideoJS;
  content: " \f12e";
  font-size: 1.5em;
  line-height: inherit;
}

.video-js.vjs-layout-small .vjs-current-time,
.video-js.vjs-layout-small .vjs-time-divider,
.video-js.vjs-layout-small .vjs-duration,
.video-js.vjs-layout-small .vjs-remaining-time,
.video-js.vjs-layout-small .vjs-playback-rate,
.video-js.vjs-layout-small .vjs-volume-control, .video-js.vjs-layout-x-small .vjs-current-time,
.video-js.vjs-layout-x-small .vjs-time-divider,
.video-js.vjs-layout-x-small .vjs-duration,
.video-js.vjs-layout-x-small .vjs-remaining-time,
.video-js.vjs-layout-x-small .vjs-playback-rate,
.video-js.vjs-layout-x-small .vjs-volume-control, .video-js.vjs-layout-tiny .vjs-current-time,
.video-js.vjs-layout-tiny .vjs-time-divider,
.video-js.vjs-layout-tiny .vjs-duration,
.video-js.vjs-layout-tiny .vjs-remaining-time,
.video-js.vjs-layout-tiny .vjs-playback-rate,
.video-js.vjs-layout-tiny .vjs-volume-control {
  display: none;
}
.video-js.vjs-layout-small .vjs-volume-panel.vjs-volume-panel-horizontal:hover, .video-js.vjs-layout-small .vjs-volume-panel.vjs-volume-panel-horizontal:active, .video-js.vjs-layout-small .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-slider-active, .video-js.vjs-layout-small .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-hover, .video-js.vjs-layout-x-small .vjs-volume-panel.vjs-volume-panel-horizontal:hover, .video-js.vjs-layout-x-small .vjs-volume-panel.vjs-volume-panel-horizontal:active, .video-js.vjs-layout-x-small .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-slider-active, .video-js.vjs-layout-x-small .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-hover, .video-js.vjs-layout-tiny .vjs-volume-panel.vjs-volume-panel-horizontal:hover, .video-js.vjs-layout-tiny .vjs-volume-panel.vjs-volume-panel-horizontal:active, .video-js.vjs-layout-tiny .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-slider-active, .video-js.vjs-layout-tiny .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-hover {
  width: auto;
  width: initial;
}
.video-js.vjs-layout-x-small .vjs-progress-control, .video-js.vjs-layout-tiny .vjs-progress-control {
  display: none;
}
.video-js.vjs-layout-x-small .vjs-custom-control-spacer {
  flex: auto;
  display: block;
}

.vjs-modal-dialog.vjs-text-track-settings {
  background-color: #2B333F;
  background-color: rgba(43, 51, 63, 0.75);
  color: #fff;
  height: 70%;
}

.vjs-text-track-settings .vjs-modal-dialog-content {
  display: table;
}

.vjs-text-track-settings .vjs-track-settings-colors,
.vjs-text-track-settings .vjs-track-settings-font,
.vjs-text-track-settings .vjs-track-settings-controls {
  display: table-cell;
}

.vjs-text-track-settings .vjs-track-settings-controls {
  text-align: right;
  vertical-align: bottom;
}

@supports (display: grid) {
  .vjs-text-track-settings .vjs-modal-dialog-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    padding: 20px 24px 0px 24px;
  }
  .vjs-track-settings-controls .vjs-default-button {
    margin-bottom: 20px;
  }
  .vjs-text-track-settings .vjs-track-settings-controls {
    grid-column: 1/-1;
  }
  .vjs-layout-small .vjs-text-track-settings .vjs-modal-dialog-content,
  .vjs-layout-x-small .vjs-text-track-settings .vjs-modal-dialog-content,
  .vjs-layout-tiny .vjs-text-track-settings .vjs-modal-dialog-content {
    grid-template-columns: 1fr;
  }
}
.vjs-text-track-settings select {
  font-size: inherit;
}

.vjs-track-setting > select {
  margin-right: 1em;
  margin-bottom: 0.5em;
}

.vjs-text-track-settings fieldset {
  margin: 10px;
  border: none;
}

.vjs-text-track-settings fieldset span {
  display: inline-block;
  padding: 0 0.6em 0.8em;
}

.vjs-text-track-settings fieldset span > select {
  max-width: 7.3em;
}

.vjs-text-track-settings legend {
  color: #fff;
  font-weight: bold;
  font-size: 1.2em;
}

.vjs-text-track-settings .vjs-label {
  margin: 0 0.5em 0.5em 0;
}

.vjs-track-settings-controls button:focus,
.vjs-track-settings-controls button:active {
  outline-style: solid;
  outline-width: medium;
  background-image: linear-gradient(0deg, #fff 88%, #73859f 100%);
}

.vjs-track-settings-controls button:hover {
  color: rgba(43, 51, 63, 0.75);
}

.vjs-track-settings-controls button {
  background-color: #fff;
  background-image: linear-gradient(-180deg, #fff 88%, #73859f 100%);
  color: #2B333F;
  cursor: pointer;
  border-radius: 2px;
}

.vjs-track-settings-controls .vjs-default-button {
  margin-right: 1em;
}

.vjs-title-bar {
  background: rgba(0, 0, 0, 0.9);
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 60%, rgba(0, 0, 0, 0) 100%);
  font-size: 1.2em;
  line-height: 1.5;
  transition: opacity 0.1s;
  padding: 0.666em 1.333em 4em;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 100%;
}

.vjs-title-bar-title,
.vjs-title-bar-description {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vjs-title-bar-title {
  font-weight: bold;
  margin-bottom: 0.333em;
}

.vjs-playing.vjs-user-inactive .vjs-title-bar {
  opacity: 0;
  transition: opacity 1s;
}

.video-js .vjs-skip-forward-5 {
  cursor: pointer;
}
.video-js .vjs-skip-forward-10 {
  cursor: pointer;
}
.video-js .vjs-skip-forward-30 {
  cursor: pointer;
}
.video-js .vjs-skip-backward-5 {
  cursor: pointer;
}
.video-js .vjs-skip-backward-10 {
  cursor: pointer;
}
.video-js .vjs-skip-backward-30 {
  cursor: pointer;
}
@media print {
  .video-js > *:not(.vjs-tech):not(.vjs-poster) {
    visibility: hidden;
  }
}
.vjs-resize-manager {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  z-index: -1000;
}

.js-focus-visible .video-js *:focus:not(.focus-visible) {
  outline: none;
}

.video-js *:focus:not(:focus-visible) {
  outline: none;
}`;
    document.head.appendChild(style1);
  };
  const getDownloadUrlListAndKey = async (url) => {
    const data = await (await fetch(url)).text();
    const key = await getKey(data);
    const urls = data.replaceAll("\n", "").split(/#EXTINF:\d{1,3},/).slice(1);
    const urlListLast = urls[urls.length - 1];
    urls[urls.length - 1] = urlListLast.replace("#EXT-X-ENDLIST", "");
    return { urls, key };
  };
  const getKey = async (m3u8Data) => {
    const [url] = m3u8Data.match(new RegExp('(?<=URI=")[^"]+(?=")'));
    return await (await fetch(url, {
      headers: {
        Accept: "application/json, text/plain, */*"
      }
    })).arrayBuffer();
  };
  const getResolutionUrls = (m3u8Data) => {
    const urlArray = m3u8Data.split("\n").filter((s) => s.includes("https"));
    const RESOLUTIONS = m3u8Data.split("\n").filter((s) => s.includes("RESOLUTION"));
    return RESOLUTIONS.reduce((result, p, index) => {
      const [resolution] = p.match(new RegExp("(?<=RESOLUTION=).*?(?=,)"));
      result.push({
        resolution,
        url: urlArray[index]
      });
      return result;
    }, []);
  };
  const clacSize = (size) => {
    const aMultiples = ["B", "K", "M", "G", "T", "P", "E", "Z", "Y"];
    const bye = 1024;
    if (size < bye)
      return size + aMultiples[0];
    let i = 0;
    for (var l = 0; l < 8; l++) {
      if (size / Math.pow(bye, l) < 1)
        break;
      i = l;
    }
    return `${(size / Math.pow(bye, i)).toFixed(2)}${aMultiples[i]}`;
  };
  const getM3u8Data = async (id) => {
    const url = `${window.apiPrefix}fc/video_pages/${id}/session_ids`;
    const { data: { session_id } } = await req(url, "POST");
    const url2 = `https://hls-auth.cloud.stream.co.jp/auth/index.m3u8?session_id=${session_id}`;
    const m3u8Data = await (await fetch(url2)).text();
    return m3u8Data;
  };
  const getM3u8HighUrl = async (id) => {
    const m3u8Data = await getM3u8Data(id);
    const urls = getResolutionUrls(m3u8Data);
    return urls[0].url;
  };
  const processName = (time, title) => {
    return `[${time.split(" ")[0]}] ${title.replaceAll(":", ".")}.ts`.replace(/[<>/\\? \*]/g, "");
  };
  const getList = async (type, len) => {
    const list = [];
    for (let index = 1; index <= len; index++) {
      const apiPrefix = `${window.apiPrefix}fc/fanclub_sites/${window.fcId}/`;
      const url = type === "lives" ? `${apiPrefix}live_pages?page=1&live_type=3&per_page=100` : `${apiPrefix}video_pages?vod_type=0&sort=-display_date&page=${index}&per_page=100`;
      const { data: { video_pages } } = await req(url);
      list.push(...video_pages.list);
    }
    return list;
  };
  const req = (url, method = "GET", r = 0) => {
    return new Promise(async (res) => {
      const ops = {
        method,
        headers: getHeaders(),
        credentials: "include"
      };
      if (method === "POST") {
        ops.body = JSON.stringify({});
      }
      fetch(url, ops).then(async (data) => {
        if (!data.ok) {
          throw new Error("HTTP error: " + data.status);
        }
        res(data.json());
      }).catch(async (error) => {
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
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "Fc_site_id": window.fcId || 1,
      "Fc_use_device": "null",
      Authorization: window.Authorization || "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICItUnRFd09TbFVCalFza0IzQWROdmdyZmRhZHllbm1reVF1SW96dG5hdno4In0.eyJleHAiOjE2OTc4MDkwNjQsImlhdCI6MTY5NzgwODc2NCwiYXV0aF90aW1lIjoxNjk3NDc2Mzc0LCJqdGkiOiI2NzcyNDA0Yy1jODY5LTQzZGYtOWFlMC01NjliYzNmZDM5ODgiLCJpc3MiOiJodHRwczovL2F1dGguc2hlZXRhLmNvbS9hdXRoL3JlYWxtcy9GQ1MwMDAwMSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIzODI0M2E1MC1kMjFlLTQzMzEtODBmZi04YTJkOGU3ZWJhMzkiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJGQ1MwMDI3NCIsInNlc3Npb25fc3RhdGUiOiJiOWFkN2Q4NS03NTk0LTRhYjAtYjYwNC1jYWFmYzdkODRhMTAiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1mY3MwMDAwMSIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsInNpZCI6ImI5YWQ3ZDg1LTc1OTQtNGFiMC1iNjA0LWNhYWZjN2Q4NGExMCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuaWNrbmFtZSI6IuOCsuOCueODiCIsInByZWZlcnJlZF91c2VybmFtZSI6Im5pY29uaWNvXzEyNTY0MjIwMSIsImVtYWlsIjoiMTgzOTc4MTU0NkBxcS5jb20ifQ.nhuIKwTYXgBa3pViSOmvQTJY3YOTBnebYuvX9RjyF8LQLSSS-s2lzU_yTfAfHr4rEcQXV3qHTNC6PLtHcoYK7QCz0SVZsFES6xDojjk04wC3_W06vIK7Gd259JcdeyKj_chRE0ZG_v4uakKV5I1PheH4IV2LsUqRnN8b7MVh08R_G6qL5ceGcd9GBG_-rTDS3pM0UFUClFcMiq6j1d8IVm95zfq9zx789No3vW-ob6l-KOuRsEsWq2MyiSm7DrFB9-K5Q0cxBcvCQXwDxoyYQSNhx5MbDWpa1rCuUt0P92Q6WicuBfXRmfamgmH8dGpt7PAy6ERAuyu1iBriZIRtwA"
    };
    return headersData;
  };
  const updateToken = async () => {
    return new Promise((res) => {
      const ops = {
        method: "POST",
        url: "https://nfc-api.nicochannel.jp/fc/fanclub_groups/1/auth/refresh",
        data: JSON.stringify({}),
        headers: { "Cookie": document.cookie, ...getHeaders() },
        credentials: "include",
        onload: function(response) {
          window.Authorization = "Bearer " + JSON.parse(response.responseText).data.access_token;
          res("ok");
        }
      };
      GM_xmlhttpRequest(ops);
    });
  };
  const listenReq = (includesValue, conditions) => {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    const setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function(hander, value) {
      if (includesValue.some((p) => this._url.includes(p))) {
        if (hander === "Authorization")
          window.Authorization = value;
        if (hander === "Fc_site_id")
          window.fcId = value;
      }
      setRequestHeader.apply(this, arguments);
    };
    XMLHttpRequest.prototype.open = function(method, url) {
      this._url = url;
      originalOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function() {
      const { _url } = this;
      for (const item of conditions) {
        if (_url.includes(item.value)) {
          this.addEventListener("load", async function() {
            if (!window.Authorization) {
              await updateToken();
            }
            window.apiPrefix = _url.split("fc/")[0];
            const data = JSON.parse(this.response);
            item.callback(data);
          });
        }
      }
      originalSend.apply(this, arguments);
    };
  };
  const script = () => {
    const scripts = [
      "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/video.js/8.5.2/video.min.js"
    ];
    scripts.forEach((p) => {
      const script2 = document.createElement("script");
      script2.setAttribute("type", "text/javascript");
      script2.src = p;
      document.documentElement.appendChild(script2);
    });
  };
  const createDOM = (name, fun) => {
    const DOM = `<div class="m1 m3 s1 s2">
      <span class="m2 m3">${name}</span>
  </div>`;
    let newElement = document.createElement("div");
    newElement.innerHTML = DOM;
    newElement = newElement.firstChild;
    newElement.onclick = fun || null;
    return newElement;
  };
  const createDivBox = (margin) => {
    const dom = document.createElement("div");
    if (margin)
      dom.style.margin = margin;
    dom.classList.add("flex1");
    return dom;
  };
  const progress = (parentElement, len, isMultiple, margin, index = 1) => {
    const firstElement = parentElement.children[index];
    const dom = createDOM("");
    dom.style.margin = margin;
    dom.style.padding = "0 5px";
    parentElement.insertBefore(dom, firstElement);
    let i = 0;
    let size = 0;
    const remove = (time = 5500) => {
      setTimeout(() => {
        parentElement.removeChild(dom);
      }, time);
    };
    return {
      remove,
      fn: () => {
        dom.innerHTML = `下载中 0 / ${len} (0)`;
        const updateLen = (value) => {
          if (!isMultiple)
            len = value;
        };
        const update = (value) => {
          if (!isMultiple)
            i += 1;
          size += value;
          dom.innerHTML = `下载中 ${i} / ${len} (${clacSize(size)})`;
        };
        const updateIndex = () => {
          i += 1;
          update(0);
        };
        const skip = () => {
          --i;
          --len;
        };
        const err = () => {
          dom.innerHTML = `下载失败`;
          remove();
        };
        const downloaded = () => {
          dom.innerHTML = `下载完成 ${i} / ${len} (${clacSize(size)})`;
          remove();
        };
        const end = () => {
          if (!isMultiple)
            downloaded();
        };
        return {
          update,
          updateIndex,
          skip,
          err,
          end,
          downloaded,
          updateLen
        };
      }
    };
  };
  const createInput = (type) => {
    const input = document.createElement("input");
    input.type = type;
    input.style.display = "block";
    input.style.position = "absolute";
    input.style.width = "19px";
    input.style.height = "19px";
    input.style.top = "0";
    input.style.right = "0";
    input.style.margin = "12px";
    input.style.zIndex = "99999";
    return input;
  };
  const initVideo = (m3u8Data, element) => {
    if (element.querySelector("#myVideo"))
      return;
    const video = createVideo(element);
    const blob = new Blob([m3u8Data], { type: "application/x-mpegURL" });
    const url = URL.createObjectURL(blob);
    const player = videojs(video, {
      controlBar: {
        pictureInPictureToggle: true
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
      enableDocumentPictureInPicture: false
    }, () => URL.revokeObjectURL(url));
    return player;
  };
  const createVideo = (element) => {
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
  const decrypt = (m3u8Data, key) => {
    const { lib, mode, pad, AES } = CryptoJS;
    const encryptedData = new Uint8Array(m3u8Data);
    const ciphertext = lib.WordArray.create(encryptedData);
    const Key = lib.WordArray.create(key);
    const ops = {
      iv: lib.WordArray.create(16),
      mode: mode.CBC,
      padding: pad.Pkcs7
    };
    const decrypted = AES.decrypt({ ciphertext }, Key, ops);
    return wordArrayToUint8Array(decrypted);
  };
  function wordArrayToUint8Array(wordArray) {
    const len = wordArray.sigBytes;
    const words = wordArray.words;
    const uint8Array = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      uint8Array[i] = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
    }
    return uint8Array;
  }
  const download1 = async (data, progress2, name) => {
    let dir = await showDirectoryPicker({ mode: "readwrite" });
    let updateProgress = progress2();
    const isExists = async (title) => {
      try {
        const fileHandle = await dir.getFileHandle(title);
        const file = await fileHandle.getFile();
        const fileSize = file.size;
        if (fileSize > 10240) {
          updateProgress.end();
          return true;
        }
        throw new Error("File size exceeds 1MB");
      } catch (error) {
        return false;
      }
    };
    const save = async (title, url) => {
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
    dir = await getSaveDir(dir, name);
    for (const item of data) {
      updateProgress.updateIndex();
      const is = await isExists(item.title);
      if (is)
        updateProgress.skip();
      else {
        const url = await getM3u8HighUrl(item.id);
        await save(item.title, url);
      }
    }
    updateProgress.downloaded();
  };
  const downloadStream = async (m3u8UrlData, updateProgress) => {
    const { urls, key } = m3u8UrlData;
    const downAndDecryptFun = async (url, retryCount = 0) => {
      try {
        const uint8Array = decrypt(await (await fetch(url)).arrayBuffer(), key);
        updateProgress.update(uint8Array.byteLength);
        return uint8Array;
      } catch (error) {
        if (retryCount > 5) {
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
        let datas = await Promise.all(url.map((URL2) => downAndDecryptFun(URL2)));
        datas.forEach((value) => controller.enqueue(value));
        datas = null;
        await this.pull(controller);
      }
    });
    return { stream };
  };
  const getSaveDir = async (dir, name) => {
    const saveDir = await dir.getDirectoryHandle(name, { create: true });
    return saveDir;
  };
  const videoPageDOM = async (data, retry = 0) => {
    var _a;
    if (document.querySelector("#downloadDOM"))
      return;
    let parentElement = (_a = document.querySelector("#video-page-wrapper")) == null ? void 0 : _a.children[1];
    if (parentElement) {
      if (parentElement.querySelector(":scope>button"))
        parentElement = parentElement.children[2];
      const title = processName(data.data.video_page.released_at, document.title);
      let videoId = document.URL.split("video/")[1];
      if (!videoId)
        videoId = document.URL.split("live/")[1];
      const m3u8 = await getM3u8Data(videoId);
      addPageDOM$1(title, parentElement, m3u8);
      return;
    }
    if (retry++ > 5)
      return;
    setTimeout(() => {
      videoPageDOM(data, retry);
    }, 300);
  };
  const addPageDOM$1 = (title, parentElement, m3u8Data) => {
    const firstElement = parentElement.children[0];
    const dom = createDivBox();
    dom.id = "downloadDOM";
    let isDown2 = false;
    const m3u8 = {
      currentIndex: 0,
      urls: getResolutionUrls(m3u8Data)
    };
    dom.appendChild(sharpnessSelectDOM(m3u8));
    dom.appendChild(createDOM("play", () => {
      const DOM = document.querySelector("#video-player-wrapper");
      initVideo(m3u8Data, DOM);
    }));
    dom.appendChild(createDOM("下载1 (Chrome | edge | Opera)", async () => {
      if (isDown2) {
        alert("已在下载中");
        return;
      }
      isDown2 = true;
      const p = progress(parentElement, 0, false, "0 0 7px 0");
      try {
        await download1({ title, url: m3u8.urls[m3u8.currentIndex].url }, p.fn);
      } catch (error) {
        console.warn(error);
        p.remove(2e3);
      }
    }));
    parentElement.insertBefore(dom, firstElement);
  };
  const sharpnessSelectDOM = (m3u8) => {
    const select = document.createElement("select");
    select.classList.add("sharpnessSelect", "m1");
    select.innerHTML = m3u8.urls.reduce((result, value, index) => {
      const [left, right] = value.resolution.split("x");
      result += `<option value="${index}" ${index === 0 ? "selected" : ""}>
      ${right}p
    </option>`;
      return result;
    }, "");
    select.onchange = (e) => {
      m3u8.currentIndex = +e.target.value;
    };
    return select;
  };
  const listPageDOM = (data, retry = 0) => {
    var _a;
    const type = document.URL.split("/").at(-1).replace(/\?.*/, "");
    if (!data.data.video_pages.total || !["videos", "lives"].some((p) => p === type))
      return;
    const parentElement = document.querySelector(".MuiBox-root").children[1].children[0].children[0];
    const list = (_a = parentElement.querySelector(".infinite-scroll-component")) == null ? void 0 : _a.children[0];
    if (parentElement && list) {
      updateListData(data.data.video_pages);
      let countDOM = document.querySelector("#downloadCount");
      if (!countDOM) {
        addPageDOM(parentElement, type);
        countDOM = document.querySelector("#downloadCount").children[0];
        addListInputDOM(list, countDOM, type);
      }
      return;
    }
    if (retry++ > 5)
      return;
    setTimeout(() => {
      listPageDOM(data, retry);
    }, 300);
  };
  const addPageDOM = (parentElement, type) => {
    const margin = type === "lives" ? "0 0 0.4rem 0" : "0 0 0.4rem 0.75rem";
    const index = type === "lives" ? 2 : 1;
    const firstElement = parentElement.children[index];
    const tip = createDivBox(margin);
    const dom = createDivBox(type === "lives" ? "0" : "0 0 0 0.75rem");
    tip.appendChild(createDOM("默认下载最高画质,会跳过已下载的文件"));
    tip.appendChild(createDOM("点击查看支持浏览器", () => {
      window.open("https://caniuse.com/?search=showDirectoryPicker", "_blank");
    }));
    dom.appendChild(createDOM("下载", async () => {
      downloadHandler(parentElement, false, margin, index);
    }));
    dom.appendChild(createDOM("全部下载", async () => {
      if (Object.keys(listData.list).length !== listData.total) {
        const list = await getList(type, Math.ceil(listData.total / 100));
        updateListData({ list, total: listData.total });
      }
      downloadHandler(parentElement, true, margin, index);
    }));
    const countDOM = createDOM(`0 / ${listData.total}`);
    countDOM.id = "downloadCount";
    dom.appendChild(countDOM);
    parentElement.insertBefore(tip, firstElement);
    parentElement.insertBefore(dom, firstElement);
  };
  const addListInputDOM = (parentElement, countDOM, type) => {
    let i = 0;
    const addInputFun = (dom) => {
      dom.style.position = "relative";
      const domClass = type === "lives" ? ".MuiTypography-subtitle2" : ".MuiTypography-colorTextPrimary";
      const textDOM = dom.querySelector(domClass);
      const title = textDOM.innerText;
      const input = createInput("checkbox");
      if (type === "lives")
        input.style.margin = "0px 12px";
      input.onchange = () => {
        i += input.checked ? 1 : -1;
        listData.list[title].isDown = input.checked;
        countDOM.innerHTML = `${i} / ${listData.total}`;
      };
      dom.appendChild(input);
    };
    if (!parentElement.children[1])
      parentElement = parentElement.parentElement;
    listenerDOMAdd(parentElement, addInputFun);
    const listDOM = Array.from(parentElement.children);
    listDOM.forEach((p) => addInputFun(p));
  };
  const listData = {
    list: {},
    total: 0
  };
  const updateListData = (data) => {
    data.list.reduce((result, value) => {
      const title = processName(value.released_at, value.title);
      result[value.title] = { title, id: value.content_code, isDown: false };
      return result;
    }, listData.list);
    listData.total = data.total;
  };
  let unObserverList = () => {
  };
  let isDown = false;
  const downloadHandler = async (dom, isAll, margin, index) => {
    if (isDown)
      return;
    let list = Object.values(listData.list);
    if (!isAll)
      list = list.filter((p2) => p2.isDown);
    if (!list.length) {
      alert("尚未选择视频");
      return;
    }
    isDown = true;
    const p = progress(dom, list.length, true, margin, index);
    try {
      await download1(list, p.fn, document.title);
    } catch (error) {
      console.warn(error);
      p.remove();
    }
    isDown = false;
  };
  const listenerDOMAdd = (dom, fun) => {
    unObserverList();
    const observer = new MutationObserver(function(mutationRecoards, observer2) {
      for (const item of mutationRecoards) {
        if (item.type === "childList") {
          const DOM = item.addedNodes[0];
          fun(DOM);
        }
      }
    });
    unObserverList = () => {
      observer.disconnect();
    };
    observer.observe(dom, { childList: true });
    return observer;
  };
  style();
  script();
  listenReq(["public_status", "video_pages?vod_type", "live_pages?page"], [
    { value: "public_status", callback: videoPageDOM },
    { value: "video_pages?vod_type", callback: listPageDOM },
    { value: "live_pages?page", callback: listPageDOM },
    {
      value: "content_providers",
      callback: (data) => {
        window.fcId = data.data.content_providers.id;
      }
    }
  ]);

})();