import { useControlContext } from "../../lib/use-control-context";
import { JSXElementConstructor, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../../ui/select";

export type Option<T = string> = { label: string; value: T; icon?: React.FC };
export type Options<T = string> = Option<T>[];

export function SelectControl<ValueType extends string = string>({
  renderDefaultIcon,
  onChange,
  options,
  value,
  defaultValue,
}: {
  renderDefaultIcon: JSXElementConstructor<any>;
  onChange: (val: ValueType) => void;
  options: Option<ValueType>[];
  value: ValueType;
  defaultValue: ValueType;
}) {
  const { readOnly } = useControlContext();

  type OptionsByValue = Record<ValueType, Option>;

  const optionsByValue = useMemo(
    () =>
      options.reduce<OptionsByValue>(
        (acc, option) => ({ ...acc, [option.value]: option }),
        {} as OptionsByValue
      ),
    [options]
  );

  const TriggerIcon = (value && optionsByValue[value]?.icon) ?? renderDefaultIcon;
  const hasOptions = options.length > 0;
  const isDefault = value === defaultValue;

  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as ValueType)}
      disabled={readOnly || !hasOptions}
    >
      <SelectTrigger
        size="sm"
        className={
          isDefault ? "text-muted-foreground" : "text-foreground"
        }
        aria-label="Select"
      >
        <TriggerIcon />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <SelectItem key={option.value} value={option.value}>
              {Icon ? (
                <span className="inline-flex size-4 items-center justify-center">
                  <Icon />
                </span>
              ) : null}
              {option.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
