import { Word } from "./ProvidersInterface";

export interface WordEditProps {
  editId: number;
  wordEdit: Word;
  handleCloseModal: () => void;
}
