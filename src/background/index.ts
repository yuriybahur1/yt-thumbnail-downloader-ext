import type { Msg, Resp } from '../types';
import { getThumbnailUrl } from '../utils/getThumbnailUrl';

const downloadThumbnail = async (videoId: string) => {
  try {
    return chrome.downloads.download({
      url: getThumbnailUrl(videoId),
      filename: `${videoId}_thumbnail.jpg`,
    });
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Unexpected error occurred');
  }
};

chrome.runtime.onMessage.addListener((msg: Msg, _, sendResponse: (r: Resp) => void) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (msg.type === 'DOWNLOAD_THUMBNAIL') {
    downloadThumbnail(msg.videoId)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((err: unknown) => {
        sendResponse({ success: false, error: (err as Error).message });
      });
  }

  // Return true to indicate you want to send a response asynchronously
  return true;
});
