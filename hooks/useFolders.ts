import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useAuth } from "./useAuth";
import Router from "next/router";
import { useState } from "react";
import { FoldersType } from "../Interfaces/ProvidersInterface";

export const useFolders = () => {
  const { authContext } = useAuth();

  const [foldersHook, setFoldersHook] = useState([] as FoldersType[]);

  const createFolder = async (nameFolder: string) => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "folders", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const arr = docSnap.data().folders;

        const newFolder = {
          id: arr.length ? arr[arr.length - 1].id + 1 : 1,
          name: nameFolder,
          englishWords: [],
          russianWords: [],
        };
        arr.push(newFolder);

        setDoc(docRef, { folders: arr });
        return;
      }
    }
  };

  const getFolders = async () => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "folders", authContext.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFoldersHook(docSnap.data().folders);
      } else {
        const db = getFirestore();
        const collectionId = "folders";
        const documentId = authContext.user.uid;

        const value = {
          folders: [],
          uid: authContext.user.uid,
        };
        setDoc(doc(db, collectionId, documentId), value);
        Router.push("/enter");
      }
    }
  };

  const deleteFolder = async (id: number) => {
    if (authContext.user) {
      const db = getFirestore();
      const docRef = doc(db, "folders", authContext.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let arr = docSnap.data().folders;

        const index = arr.map((id: FoldersType) => id.id).indexOf(id);

        arr.splice(index, 1);

        setDoc(docRef, { folders: arr });

        setTimeout(() => {
          getFolders();
        }, 500);
      }
    }
  };

  return { createFolder, getFolders, deleteFolder, foldersHook };
};
