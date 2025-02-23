import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import About from '../About';

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Dashboard />,
    },
    {
      path: '/about',
      element: <About />,
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
