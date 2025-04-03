import { initializeApp } from "firebase/app";

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyBGLZWHouUn4TxubpxdWHw9MgkC6Rwgu3o",
    authDomain: "mediconfianza-c3ddf.firebaseapp.com",
    projectId: "mediconfianza-c3ddf",
    storageBucket: "mediconfianza-c3ddf.firebasestorage.app",
    messagingSenderId: "629726264481",
    appId: "1:629726264481:web:25aac19e49d7f4ea06c4e0"
  },
};

const app = initializeApp(environment.firebaseConfig);
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
