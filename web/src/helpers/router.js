import { debounce } from 'lodash';

import thirdPartyServices from '../services/thirdparty';

// Map from querystring key to state key
export const queryStringMappings = {
  countryCode: 'selectedZoneName',
  datetime: 'customDate',
  page: 'showPageState',
  solar: 'solarEnabled',
  remote: 'useRemoteEndpoint',
  wind: 'windEnabled',
};

export function getStateFromURL(urlSearch) {
  const params = new URLSearchParams(urlSearch);
  const state = {};

  Object.keys(queryStringMappings).forEach((key) => {
    let value = params.get(key);
    if (!value) return;

    // Convert to boolean type if the value is 'true' or 'false'
    if (['true', 'false'].includes(value.toLowerCase())) {
      value = (value.toLowerCase() === 'true');
    }
    state[queryStringMappings[key]] = value;
  });

  return state;
}

function instantUpdateURLFromState(state) {
  const params = new URLSearchParams();
  Object.keys(queryStringMappings).forEach((key) => {
    const value = state.application[queryStringMappings[key]];
    if (value) {
      params.append(key, value);
    }
  });

  const urlSearch = `?${params.toString()}`;
  if (urlSearch !== window.location.search) {
    if (thirdPartyServices._ga) {
      thirdPartyServices._ga.config({ page_path: urlSearch });
    }
    window.history.pushState(getStateFromURL(urlSearch), '', urlSearch);
  }
}

export const updateURLFromState = debounce(instantUpdateURLFromState, 0);
