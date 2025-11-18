import Constants from 'expo-constants';

const DEFAULT_BASE_URL = Constants.expoConfig?.extra?.backendUrl ?? 'http://127.0.0.1:8000';
let overrideBaseUrl = null;

export const setBackendUrl = (url) => {
  overrideBaseUrl = url?.trim() || null;
};

export const getBackendUrl = () => overrideBaseUrl || DEFAULT_BASE_URL;

const handleResponse = async (response) => {
  if (response.status === 204) {
    return null;
  }
  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || 'Unexpected server error');
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    return text;
  }
};

export async function listCaptures({ limit = 50, offset = 0, tag } = {}) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (tag) params.append('tag', tag);
  const response = await fetch(`${getBackendUrl()}/captures?${params.toString()}`);
  return handleResponse(response);
}

export async function searchCaptures({ query, tag, start, end }) {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (tag) params.append('tag', tag);
  if (start) params.append('start', start);
  if (end) params.append('end', end);
  const response = await fetch(`${getBackendUrl()}/search?${params.toString()}`);
  return handleResponse(response);
}

export async function createTextCapture(payload) {
  const response = await fetch(`${getBackendUrl()}/captures/text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function uploadScreenshot(asset, metadata = {}) {
  if (!asset) {
    throw new Error('Please select a screenshot first');
  }
  const formData = new FormData();
  formData.append('file', {
    uri: asset.uri,
    name: asset.name || 'capture.jpg',
    type: asset.mimeType || 'image/jpeg',
  });
  if (metadata.source) formData.append('source', metadata.source);
  if (metadata.tags?.length) formData.append('tags', metadata.tags.join(','));
  if (metadata.captured_at) formData.append('captured_at', metadata.captured_at);

  const response = await fetch(`${getBackendUrl()}/captures/image`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse(response);
}

export async function updateTags(id, tags) {
  const response = await fetch(`${getBackendUrl()}/captures/${id}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tags }),
  });
  return handleResponse(response);
}
