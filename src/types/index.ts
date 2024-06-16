export interface Msg {
  type: 'DOWNLOAD_THUMBNAIL';
  videoId: string;
}

interface SuccessResp {
  success: true;
}

interface ErrorResp {
  success: false;
  error: string;
}

export type Resp = SuccessResp | ErrorResp;
