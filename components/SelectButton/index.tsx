import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export const SelectButton = ({ status }: { status: boolean }) => {
  return (
    <>{status ? <CheckCircleOutlineIcon /> : <RadioButtonUncheckedIcon />}</>
  );
};
