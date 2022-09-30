/*  This module includes all the required calls to the generator service.
 *  @author lampridis
 */
import env from '../../config/env';
import Sentry from '@sentry/node';
import fetch from 'node-fetch';

const URL = env.GENERATOR_SERVICE_URL();

/** This function call the generator with a requestData as json.
 * @param requestData  json  the project name, _id, owner and OpenAPI
 * @return bundledLink json  the link to download with the up time and names
 */
export async function getServerLink (requestData) {
  /** request data has _id and owner which are ObjectId but can transform to strings
   *  any other object must be stringified
   */
  const params = await createParameters({
    ...requestData,
    openApiSpec: JSON.stringify(requestData.openApiSpec),
    deployConfig: JSON.stringify(requestData.deployConfig)
  });

  return callFetch({
    params,
    method: 'POST',
    url: '/generateServer/nodeServer'
  });
}

/** This function call the generator with a requestData as json.
 * @param requestData  json  the project name, _id, owner and OpenAPI, pagesCss, pagesHtml
 * @return bundledLink json  the link to download with the up time and names
 */
export async function getFrontSDKLink (requestData) {
  /** request data has _id and owner which are ObjectId but can transform to strings
   *  any other object must be stringified
   */
  const params = await createParameters({
    ...requestData,
    openApiSpec: JSON.stringify(requestData.openApiSpec),
    pagesCss: JSON.stringify(requestData.pagesCss),
    pagesHtml: JSON.stringify(requestData.pagesHtml),
    pagesJavascript: JSON.stringify(requestData.pagesJavascript),
    deployConfig: JSON.stringify(requestData.deployConfig)
  });
  return callFetch({
    params,
    method: 'POST',
    url: '/generateFrontSdk/frontSDK/javascript'
  });
}

/** This function call the generator with a requestData as json.
 * @param requestData  json  the project name, _id, owner and OpenAPI, pagesCss, pagesHtml
 * @return bundledLink json  the link to download with the up time and names
 */
export async function getFrontSDKArtifact (requestData, fileName) {
  /** request data has _id and owner which are ObjectId but can transform to strings
   *  any other object must be stringified
   */
  const params = await createParameters({
    ...requestData,
    openApiSpec: JSON.stringify(requestData.openApiSpec),
    fileName
  });
  console.log('call fetch');
  const response = await callFetch({
    params,
    method: 'POST',
    url: '/generateFrontSdk/artifact'
  });

  return response;
}

/** This function send the generator to deploy to github the project
 * @param {string} name  the project nameD
 * @param {string} projectOwner  the project's owner id
 * @return
 */
export async function postDeployAction (name, projectOwner) {
  /** request data has _id and owner which are ObjectId but can transform to strings
   *  any other object must be stringified
   */
  const params = await createParameters({ name, projectOwner });
  const response = await callFetch({
    params,
    method: 'POST',
    url: '/deployAction'
  });

  return response;
}

/** This function send the generator to deploy to github the project
 * @param {string} name  the project nameD
 * @param {string} projectOwner  the project's owner id
 * @return
 */
export async function getListAction (name, projectOwner) {
  /** request data has _id and owner which are ObjectId but can transform to strings
   *  any other object must be stringified
   */
  const params = await createParameters({ name, projectOwner });
  const response = await callFetch({
    params,
    method: 'POST',
    url: '/listActions'
  });

  return response;
}

export async function createParameters (objectToParam) {
  return Object.keys(objectToParam).reduce((params, key) => {
    params.append(key, objectToParam[key]);
    return params;
  }, new URLSearchParams());
}

async function callFetch ({ url, method, params }) {
  return fetch(URL + url, {
    method: method,
    body: params
  })
    .then(async res => {
      if (res.status !== 200) {
        throw Error(`code:${res.status},message: ${await res.json()}`);
      }
      return res.json();
    })
    .catch(error => {
      console.log(error);
      Sentry.captureException(error);
      throw error;
    });
}

export default {
  getServerLink,
  getFrontSDKLink,
  getFrontSDKArtifact,
  postDeployAction,
  getListAction
};
