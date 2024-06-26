type PanelHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export const PanelHeader = ({ title, children }: PanelHeaderProps) => {
  return (
    <div id="panel-header" className="mb-[24px]">
      <div id="panel-title" className="">
        <div id="basic-info-title" className="">
          <h2
            className="
            text-[20px] font-semibold text-[#222222] mb-[16px]
            "
          >
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
};
