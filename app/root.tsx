import { Link, LiveReload, Outlet, Links } from "remix";
import globalCss from "~/styles/global.css";
export const links = () => [{ rel: "stylesheet", href: globalCss }];
export default function App() {
  return (
    <Document title={"remix demo"}>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactElement;
  title: string;
}) {
  return (
    <html lang="en">
      <head>
        <Links />
        <title>{title}</title>
      </head>
      <body>
        {/* load the content */}
        {children}
        {/* enable live reload in dev*/}
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

function Layout({ children }: { children: React.ReactElement }) {
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          Remix
        </Link>
        <ul className="nav">
          <li>
            <Link to="/posts">Posts</Link>
          </li>
        </ul>
      </nav>
      <div className="container">{children}</div>
    </>
  );
}
