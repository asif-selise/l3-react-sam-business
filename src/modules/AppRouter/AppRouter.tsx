import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Dashboard />,
    },
  ]);
  return (
    <>
      {/* <Suspense fallback={fallback}>{element}</Suspense> */}
      <RouterProvider router={router} />
    </>
  );
};

export default AppRouter;
