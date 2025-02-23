import { useLocation } from "react-router-dom";


type ReturnType = boolean;

export function useActiveLink(path: string): ReturnType {
  const location = useLocation();
  const pathname = location.pathname;

  const invalidPath = path.startsWith('#');

  const currentPath = path === '/' ? '/' : `${path}`;

  return !invalidPath && pathname.includes(currentPath);
}


//need to work here