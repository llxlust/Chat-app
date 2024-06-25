import classes from "./custom-input.module.scss";
interface ICustomInputProps {
  type?: string;
  placeholder?: string;
  label?: string;
  onChangeInput: (change: string) => void;
}
export default function CustomInput({
  onChangeInput,
  label = "",
  placeholder = "",
  type = "",
}: ICustomInputProps) {
  return (
    <>
      <div className={classes.inputContainer}>
        <label>{label}</label>
        <input
          placeholder={placeholder}
          type={type}
          onChange={(e) => onChangeInput(e.target.value)}
          className={classes.inputBar}
        ></input>
      </div>
    </>
  );
}
