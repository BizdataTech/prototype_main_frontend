const AdminSectionTitle = ({ title, icon }) => {
  return (
    <h1 className="a-text--title">
      <i className={icon}></i>
      {title}
    </h1>
  );
};

export default AdminSectionTitle;
