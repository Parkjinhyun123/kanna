import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2gPKHl3GHyJuegOH_IzYgde9uDFZnI9A",
  authDomain: "stellaverse-eea81.firebaseapp.com",
  projectId: "stellaverse-eea81",
  storageBucket: "stellaverse-eea81.firebasestorage.app",
  messagingSenderId: "907180397007",
  appId: "1:907180397007:web:71ede3b6421ebc48dc02ba",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchDocumentsWithMsField(collectionName) {
  try {
    const q = query(collection(db, collectionName), where("ms", "!=", null));
    const querySnapshot = await getDocs(q);

    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    // console.log("조회된 문서들:", documents);
    return documents;
  } catch (error) {
    console.error("문서 조회 중 오류 발생:", error);
  }
}

export { fetchDocumentsWithMsField };
