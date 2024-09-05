import React, { createContext, useContext, useState } from 'react';

const DropdownMenuContext = createContext({});

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = React.forwardRef(({ children, ...props }, ref) => {
  const { setIsOpen } = useContext(DropdownMenuContext);
  return React.cloneElement(children, {
    ...props,
    ref,
    onClick: (e) => {
      children.props.onClick?.(e);
      setIsOpen((prev) => !prev);
    },
  });
});

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = ({ children, align = 'center', ...props }) => {
  const { isOpen } = useContext(DropdownMenuContext);
  if (!isOpen) return null;
  return (
    <div className={`absolute mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
      ${align === 'start' ? 'left-0' : align === 'end' ? 'right-0' : 'left-1/2 transform -translate-x-1/2'}
      ${props.className}`}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900"
      {...props}
    >
      {children}
    </div>
  );
});

DropdownMenuItem.displayName = "DropdownMenuItem";

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
