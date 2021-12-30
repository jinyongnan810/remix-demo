import {
  Link,
  LiveReload,
  Outlet,
  Links,
  Meta,
  ErrorBoundaryComponent,
} from "remix";
import globalCss from "~/styles/global.css";
export const links = () => [{ rel: "stylesheet", href: globalCss }];
export const meta = () => {
  const description = "A cool blog built with Remix";
  const keywords = "remix, react, typescript";

  return {
    description,
    keywords,
  };
};
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
        <Meta />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
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

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <Document title="Error">
      <Layout>
        <>
          <div className="page-header">
            <h1>Error</h1>
          </div>
          <p>{error.message}</p>
        </>
      </Layout>
    </Document>
  );
};
