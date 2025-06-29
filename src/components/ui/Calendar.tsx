import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';

// Define the component props with a more permissive type
type CalendarProps = {
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
  components?: {
    IconLeft?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    IconRight?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  };
  [key: string]: any; // Allow any other props
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  ...props
}: CalendarProps) {
  // Create a new components object with only the defined icons
  const dayPickerComponents = React.useMemo(() => {
    const result: any = {};
    if (components?.IconLeft) result.IconLeft = components.IconLeft;
    if (components?.IconRight) result.IconRight = components.IconRight;
    return result;
  }, [components]);

  return (
    <DayPicker
      mode="single"
      showOutsideDays={showOutsideDays}
      classNames={{
        ...classNames,
      }}
      components={dayPickerComponents}
      {...props}
    />
  );
}

export { Calendar };
