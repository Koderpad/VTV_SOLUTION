interface Props {
  children: React.ReactNode;
}
export const TemplateVendorV1: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div>{children}</div>
    </>
  );
};
