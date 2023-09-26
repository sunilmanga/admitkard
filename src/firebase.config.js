import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCpdnw0DI_08zzMI5Rqnt9TZYQlUHtMWDw",
  authDomain: "otpr-1ad6d.firebaseapp.com",
  projectId: "otpr-1ad6d",
  storageBucket: "otpr-1ad6d.appspot.com",
  messagingSenderId: "937420206553",
  appId: "1:937420206553:web:571618cebf69381ecc29c8",
  measurementId: "G-P9ESJH00X0"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);