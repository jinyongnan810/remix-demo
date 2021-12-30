import { LiveReload, Outlet } from "remix";

export default function App(){
  return (
    <Document title={'remix demo'}>
      <Outlet/>
    </Document>
  )
}

function Document({children,title}:{children:React.ReactElement ,title:string}){
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
      </head>
      <body>
        {/* load the content */}
        {children}
        {/* enable live reload in dev*/}
        {process.env.NODE_ENV ==='development' && <LiveReload/>}
      </body>
    </html>
  )
}