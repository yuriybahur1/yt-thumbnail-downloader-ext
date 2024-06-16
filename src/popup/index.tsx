import React from 'react';
import ReactDOM from 'react-dom/client';
import { displayName as extName } from '../../package.json';
import { getThumbnailUrl } from '../utils/getThumbnailUrl';
import { getYouTubeVideoId } from '../utils/getYouTubeVideoId';
import { sleep } from '../utils/sleep';
import type { Msg, Resp } from '../types';
import 'modern-normalize/modern-normalize.css';
import './index.css';

const Popup: React.FC = () => {
  const [videoId, setVideoId] = React.useState<string | null>(null);

  const [msg, setMsg] = React.useState<{ text: string; error: boolean } | null>(null);

  React.useEffect(() => {
    const init = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        const id = getYouTubeVideoId(tab.url);

        setVideoId(id);
      } catch (err) {
        setMsg({
          error: true,
          text: `Error: ${err instanceof Error ? err.message : 'unexpected error occurred'}`,
        });
      }
    };

    void init();
  }, []);

  const downloadThumbnail = async () => {
    try {
      setMsg({ error: false, text: 'Loading...' });

      const resp = await chrome.runtime.sendMessage<Msg, Resp>({
        type: 'DOWNLOAD_THUMBNAIL',
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        videoId: videoId as string,
      });

      if (resp.success) {
        setMsg({ error: false, text: 'Thumbnail downloaded successfully!' });

        await sleep(2000);

        window.close();
      } else {
        throw new Error(resp.error);
      }
    } catch (err) {
      setMsg({
        error: true,
        text: `Error: ${err instanceof Error ? err.message : 'unexpected error occurred'}`,
      });
    }
  };

  return (
    <>
      <h2>{extName}</h2>
      {videoId ? (
        <div>
          <img src={getThumbnailUrl(videoId)} alt="YouTube Thumbnail" className="img" />
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <button onClick={downloadThumbnail} className="btn">
            Download thumbnail
          </button>
        </div>
      ) : (
        <div>Go to YouTube video page to download thumbnail!</div>
      )}
      {msg && <div className={msg.error ? 'msg error' : 'msg'}>{msg.text}</div>}
    </>
  );
};

const appEl = document.querySelector('#app');

if (appEl) {
  ReactDOM.createRoot(appEl).render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>,
  );
}
