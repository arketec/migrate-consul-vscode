// eslint-disable-next-line @typescript-eslint/naming-convention
function Button({
  id,
  onClick,
  children,
}: {
  id: string;
  onClick?: () => void;
  children?: any;
}) {
  return (
    <button onClick={onClick} id={id}>
      {children}
    </button>
  );
}

export default Button;
