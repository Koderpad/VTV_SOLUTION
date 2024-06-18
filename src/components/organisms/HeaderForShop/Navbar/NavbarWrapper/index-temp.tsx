import { FlexCenter } from "../FlexCenter/index-temp";
import { NavbarLink } from "../NavbarLink/index-temp";

export const NavbarWrapper = () => {
  return (
    <div className="flex justify-between items-center max-w-full px-4 py-2 text-white">
      <FlexCenter stackProps={{ className: "flex-grow flex-row gap-4" }} />
      <div className="flex-grow w-20"></div> {/* Khoảng trống */}
      <NavbarLink />
    </div>
  );
};
