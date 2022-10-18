import { Dispatch, SetStateAction } from "react";
import { Word } from "./ProvidersInterface";

export interface WordEditProps {
  folderId?: number;
  editId: number;
  wordEdit: Word;
  handleCloseModal: () => void;
  setStatusLoadingUser: Dispatch<SetStateAction<boolean>>;
}

export interface WordEditFolderProps {
  folderId: number;
  editId: number;
  wordEdit: Word;
  handleCloseModal: () => void;
  setStatusLoadingUser: Dispatch<SetStateAction<boolean>>;
}
