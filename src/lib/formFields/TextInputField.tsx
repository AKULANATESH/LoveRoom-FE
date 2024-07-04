import { type OutlinedTextFieldProps, TextField } from "@mui/material";
import { isDefined } from "@src/utils/isDefined";
import { type ReactElement } from "react";
import { useController } from "react-hook-form";

interface TextInputFieldProps extends Omit<OutlinedTextFieldProps, "variant"> {
  name: string;
}

export function TextInputField(props: TextInputFieldProps): ReactElement {
  const { name, disabled = false, ...otherProps } = props;
  const {
    field,
    formState: { isSubmitting },
    fieldState: { error },
  } = useController({
    name,
  });

  return (
    <TextField
      {...otherProps}
      {...field}
      variant="outlined"
      disabled={isSubmitting || disabled}
      error={isDefined(error?.message)}
      InputLabelProps={{
        shrink: true,
      }}
      helperText={error?.message}
    />
  );
}
