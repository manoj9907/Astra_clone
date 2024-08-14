import React from "react";

// https://stackoverflow.com/a/68009016
function keyDownA11y(handler) {
  return function onKeyDown(event) {
    if (
      ["keydown", "keypress"].includes(event.type) &&
      ["Enter", " "].includes(event.key)
    ) {
      handler();
    }
  };
}

/// A clickable div element that implements a11y best practices
export default function DivButton({ className, onClick, children }) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={className}
      onClick={onClick}
      onKeyDown={keyDownA11y(onClick)}
    >
      {children}
    </div>
  );
}

// export function Button({
//   className,
//   onClick,
//   children,
//   isPressed,
// }) {
//   const [isPressed, setIsPressed] = useRef(false);
//   return (
//     <button
//         type="button"
//         className={`${className }`}
//         onClick={onClick}
//         onKeyDown={keyDownA11y(onClick)}
//     >
//         {children}
//     </button>
//   );
// }

// export function NeutralButtonLg({
//   className,
//   onClick,
//   children,
// }) {
//   return <Button className={`${className} bg-white text-black font-semibold w-[36rem] h-12 mt-6 shadow-sharp-lg-purple hover:bg-gray-200 active:shadow-none active:translate-y-1 active:translate-x-1`}>
//       {children}
//   </Button>;
// }
