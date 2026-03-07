const { AdminProvider } = require("./AdminContext");
const { default: AdminLayout } = require("./AdminLayout");

const Layout = ({ children }) => {
  return (
    <AdminProvider>
      <AdminLayout>{children}</AdminLayout>
    </AdminProvider>
  );
};

export default Layout;
