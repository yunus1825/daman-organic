import { Link } from "react-router-dom";

const RouterLink = ({ to, children, scrollBehavior = "instant", ...rest }) => {
  const handleClick = (e) => {
    if (rest.onClick) rest.onClick(e);
    window.scrollTo({ top: 0, behavior: scrollBehavior });
  };

  return (
    <Link to={to} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
};

export default RouterLink;
