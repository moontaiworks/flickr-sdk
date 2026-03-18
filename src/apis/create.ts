import createAccessToken from "./auth/access-token.js";
import createRequestToken from "./auth/request-token.js";
import type { GeneralOptions } from "./options.js";
import createPhotosDelete from "./rest/photos/delete.js";
import createPhotosUploadCheckTickets from "./rest/photos/upload/check-tickets.js";
import createPhotosetsAddPhoto from "./rest/photosets/add-photo.js";
import createPhotosetsCreate from "./rest/photosets/create.js";
import createPhotosetsDelete from "./rest/photosets/delete.js";
import createPhotosetsEditMeta from "./rest/photosets/edit-meta.js";
import createTestEcho from "./rest/test/echo.js";
import createTestLogin from "./rest/test/login.js";
import createTestNull from "./rest/test/null.js";
import createReplace from "./upload/replace.js";
import createUpload from "./upload/upload.js";

export default function createEndpoint(optionsDefault?: GeneralOptions) {
  return {
    oauth: {
      accessToken: createAccessToken(optionsDefault),
      requestToken: createRequestToken(optionsDefault),
    },
    photos: {
      delete: createPhotosDelete(optionsDefault),
      upload: {
        checkTickets: createPhotosUploadCheckTickets(optionsDefault),
      },
    },
    photosets: {
      addPhoto: createPhotosetsAddPhoto(optionsDefault),
      create: createPhotosetsCreate(optionsDefault),
      delete: createPhotosetsDelete(optionsDefault),
      editMeta: createPhotosetsEditMeta(optionsDefault),
    },
    replace: createReplace(optionsDefault),
    test: {
      echo: createTestEcho(optionsDefault),
      login: createTestLogin(optionsDefault),
      null: createTestNull(optionsDefault),
    },
    upload: createUpload(optionsDefault),
  };
}
