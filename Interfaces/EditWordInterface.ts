import { Dispatch, SetStateAction } from "react";
import { Word } from "./ProvidersInterface";

export interface WordEditProps {
  editId: number;
  wordEdit: Word;
  handleCloseModal: () => void;
  setStatusLoadingUser: Dispatch<SetStateAction<boolean>>;
}
