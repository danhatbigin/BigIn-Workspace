import { Label, ListBox, Select } from '@heroui/react';

/** Composed select; stock trigger, popover, selection and keyboard behavior. */
export function ProjectSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <Select aria-label={label} selectedKey={value} onSelectionChange={key => { if (key !== null) onChange(String(key)); }}>
    <Label>{label}</Label><Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
    <Select.Popover className="ds-elevation-2"><ListBox>{options.map(option => <ListBox.Item key={option} id={option} textValue={option}>{option}<ListBox.ItemIndicator /></ListBox.Item>)}</ListBox></Select.Popover>
  </Select>;
}
