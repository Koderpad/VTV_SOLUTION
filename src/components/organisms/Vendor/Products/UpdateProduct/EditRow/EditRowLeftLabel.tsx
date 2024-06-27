type EditRowLeftLabelProps = {
  label: string;
  children?: React.ReactNode;
};

export const EditRowLeftLabel = ({
  label,
  children,
}: EditRowLeftLabelProps) => {
  return (
    <div
      id="edit-row-left edit-label"
      className="flex w-[180px] h-[40px] justify-center items-center"
    >
      <span>{label}</span>
      {children}
    </div>
  );
};
