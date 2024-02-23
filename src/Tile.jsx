import PropTypes from "prop-types";
export function Tile({ content: Content, flip, state }) {
  switch (state) {
    case "start":
      return (
        <Back
          className="inline-block h-16 w-16 md:h-20 md:w-20 bg-blue-300 cursor-pointer rounded-md"
          flip={flip}
        />
      );
    case "flipped":
      return (
        <Front className="inline-block h-16 w-16 md:h-20 md:w-20 bg-blue-500 ">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Front>
      );
    case "matched":
      return (
        <Matched className="inline-block h-12 w-12 md:h-20 md:w-20 text-gray-300">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Matched>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}

Tile.propTypes = {
  content: PropTypes.elementType.isRequired,
  flip: PropTypes.func.isRequired,
  state: PropTypes.oneOf(["start", "flipped", "matched"]).isRequired,
};

function Back({ className, flip }) {
  return <div onClick={flip} className={`${className} cursor-pointer`}></div>;
}
Back.propTypes = {
  className: PropTypes.string,
  flip: PropTypes.func.isRequired,
};

function Front({ className, children }) {
  return <div className={className}>{children}</div>;
}

Front.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

function Matched({ className, children }) {
  return <div className={className}>{children}</div>;
}

Matched.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
