import { FieldPropsInternal } from "../..";
import { Input } from "../../../ui/input";
import { useLocalValue } from "../../lib/use-local-value";

export const DefaultField = ({
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
      <Input
        id={id}
        name={name}
        type={field.type}
        title={label || name}
        autoComplete="off"
        value={localValue}
        onChange={(e) => {
          if (field.type === "number") {
            const numberValue = Number(e.currentTarget.value);
            if (typeof field.min !== "undefined" && numberValue < field.min) {
              return;
            }
            if (typeof field.max !== "undefined" && numberValue > field.max) {
              return;
            }
            onChangeLocal(numberValue);
          } else {
            onChangeLocal(e.currentTarget.value);
          }
        }}
        readOnly={readOnly}
        tabIndex={readOnly ? -1 : undefined}
        min={field.type === "number" ? field.min : undefined}
        max={field.type === "number" ? field.max : undefined}
        placeholder={
          field.type === "text" || field.type === "number"
            ? field.placeholder
            : undefined
        }
        step={field.type === "number" ? field.step : undefined}
      />
    </Label>
  );
};
