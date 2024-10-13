import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';

type AppState = {
  accessToken: string | null;
  isLocalUpload: boolean;
  uploadedFilename: string;
};

const initialState: AppState = {
  accessToken: null,
  isLocalUpload: false,
  uploadedFilename: '',
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => ({
    setAccessToken(accessToken: string | null) {
      patchState(store, (state) => ({ accessToken: accessToken }));
    },

    clearAccessToken() {
      patchState(store, (state) => ({ accessToken: null }));
    },

    setIsLocalUpload(isLocalUpload: boolean) {
      patchState(store, (state) => ({ isLocalUpload: isLocalUpload }));
    },

    setUploadedFilename(filename: string) {
      patchState(store, (state) => ({ uploadedFilename: filename }));
    },

  }))
);
