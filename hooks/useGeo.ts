import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";
import {useAuth} from "./useAuth";
import {firebaseConfig} from "../firebase-config";

export const useGeo = () => {
    const {authContext} = useAuth();


    const addGeo = async (lat: number, lon: number) => {
        firebaseConfig
        if (authContext.user) {
            const db = getFirestore();
            const docRef = doc(db, "geo", authContext.user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const arr = docSnap.data();
                const cord = {
                    lat,
                    lon,
                }
                arr.geoCord.push(cord)
                setDoc(docRef, arr);
                return;
            } else {
                const db = getFirestore();
                const collectionId = "geo";
                const documentId = authContext.user.uid;
                const cord = {
                    lat,
                    lon,
                }
                const value = {
                    geoCord: [cord]
                }
                setDoc(doc(db, collectionId, documentId), value);
                return
            }

        }
    };


    return {
        addGeo,
    };
};
