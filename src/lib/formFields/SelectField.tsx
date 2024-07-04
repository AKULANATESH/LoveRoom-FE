import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectProps,
} from "@mui/material";
import { isDefined } from "@src/utils/isDefined";
import { type ReactElement } from "react";
import { useController } from "react-hook-form";

type SelectFieldProps = Omit<SelectProps, "variant"> & {
  name: string;
  options: { key: string; value: string }[];
};

export function SelectField(props: SelectFieldProps): ReactElement {
  const { name, id, options, disabled = false, fullWidth, ...otherProps } = props;
  const {
    field,
    formState: { isSubmitting },
    fieldState: { error },
  } = useController({
    name,
  });

  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel id={name} htmlFor={id} error={isDefined(error?.message)}>
        {otherProps.label}
      </InputLabel>
      <Select
        {...otherProps}
        {...field}
        disabled={isSubmitting || disabled}
        error={isDefined(error?.message)}
      >
        {options.map((option) => (
          <MenuItem key={option.key} value={option.value}>
            {option.key}
          </MenuItem>
        ))}
      </Select>
      {isDefined(error?.message) && <FormHelperText error>{error?.message}</FormHelperText>}
    </FormControl>
  );
}
