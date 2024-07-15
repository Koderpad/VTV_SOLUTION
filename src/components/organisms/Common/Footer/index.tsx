export const Footer = () => {
  return (
    <footer className="text-center border border-slate-100 mb-16 lg:mb-0">
      <div className="max-w-screen-2xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <nav className="grid grid-cols-2 gap-4 p-6 justify-items-center text-sm font-medium rounded-lg sm:grid-cols-4 lg:grid-cols-4">
            {/* <a href="">Blog</a> */}
            {/* <a href="" className="hover:opacity-75">
              Github Repo
            </a>
            <a href="" className="hover:opacity-75">
              Resources
            </a> */}
            {/* <a href="" className="hover:opacity-75">
              Resources
            </a> */}
            {/* <a href="" className="hover:opacity-75">
              Resources
            </a> */}
          </nav>
          <p className="max-w-lg mx-auto text-xs text-gray-500"></p>
          <p className="text-xs font-medium">© 2024 vtv.com</p>
        </div>
      </div>
    </footer>
  );
};
