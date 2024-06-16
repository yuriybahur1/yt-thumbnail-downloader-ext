export const getYouTubeVideoId = (urlStr: string | undefined): string | null => {
  if (!urlStr) return null;

  try {
    const url = new URL(urlStr);

    // For standard YouTube URL, e.g., https://www.youtube.com/watch?v=video_id
    if (url.hostname.includes('youtube.com')) {
      return url.searchParams.get('v');
    }

    // For shortened YouTube URL, e.g., https://youtu.be/video_id
    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1);
    }
  } catch {
    return null;
  }

  return null;
};
