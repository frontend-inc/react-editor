import { FieldPropsInternal } from "../..";
import { useDeepField } from "../../lib/use-deep-field";
import { Tabs, TabsList, TabsTrigger } from "../../../ui/tabs";

export const RadioField = ({
  field,
  onChange,
  readOnly,
  id,
  name = id,
  label,
  labelIcon,
  Label,
}: FieldPropsInternal) => {
  const value = useDeepField(name);

  if (field.type !== "radio" || !field.options) {
    return null;
  }

  const serialize = (v: unknown) => JSON.stringify({ value: v });

  return (
    <Label icon={labelIcon} label={label || name} readOnly={readOnly} el="div">
      <Tabs
        value={serialize(value)}
        onValueChange={(v) => {
          if (readOnly) return;
          onChange(JSON.parse(v).value);
        }}
      >
        <TabsList className="w-full" id={id}>
          {field.options.map((option) => (
            <TabsTrigger
              key={option.label + JSON.stringify(option.value)}
              value={serialize(option.value)}
              disabled={readOnly}
            >
              {option.label || option.value?.toString()}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </Label>
  );
};
