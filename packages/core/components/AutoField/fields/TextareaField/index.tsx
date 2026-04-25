import { FieldPropsInternal } from "../..";
import { Textarea } from "../../../ui/textarea";
import { useLocalValue } from "../../lib/use-local-value";

export const TextareaField = ({
  field,
  onChange,
  readOnly,
  id,
  name = id,
  label,
  labelIcon,
  Label,
}: FieldPropsInternal) => {
  const [localValue, onChangeLocal] = useLocalValue(name, onChange);

  return (
    <Label label={label || name} icon={labelIcon} readOnly={readOnly}>
      <Textarea
        id={id}
        name={name}
        autoComplete="off"
        value={typeof localValue === "undefined" ? "" : localValue}
        onChange={(e) => onChangeLocal(e.currentTarget.value)}
        readOnly={readOnly}
        tabIndex={readOnly ? -1 : undefined}
        rows={5}
        placeholder={field.type === "textarea" ? field.placeholder : undefined}
      />
    </Label>
  );
};
