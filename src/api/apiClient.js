const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/v1";
const JSON_SERVER_BASE_URL =
  process.env.REACT_APP_JSON_SERVER_BASE_URL || "http://localhost:5010";

const getFallbackBaseUrls = () => {
  const baseUrls = [BASE_URL];

  if (BASE_URL.endsWith("/v1")) {
    baseUrls.push(BASE_URL.slice(0, -3));
  }

  baseUrls.push(JSON_SERVER_BASE_URL);

  return [...new Set(baseUrls)];
};

const parseResponse = async (response) => {
  const rawResponse = await response.text();
  let data = {};

  try {
    data = rawResponse ? JSON.parse(rawResponse) : {};
  } catch (error) {
    data = { message: rawResponse || "Unexpected response from server." };
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Something went wrong. Please try again.");
  }

  return data;
};

const requestWithFallback = async (endpoint, options) => {
  const baseUrls = getFallbackBaseUrls();
  console.log(baseUrls)
  let lastError;

  for (const baseUrl of baseUrls) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, options);

      try {
        return await parseResponse(response);
      } catch (error) {
        lastError = error;

        if (error.message !== "Endpoint not found.") {
          throw error;
        }
      }
    } catch (error) {
      lastError = error;

      if (error.message && error.message !== "Failed to fetch") {
        throw error;
      }
    }
  }

  throw lastError || new Error("Something went wrong. Please try again.");
};

export const postRequest = async (endpoint, body) => {
  return requestWithFallback(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

export const getRequest = async (endpoint) => {
  return requestWithFallback(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
};
