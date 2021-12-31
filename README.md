### Remix demo

- From: [Traversy Media](https://www.youtube.com/watch?v=d_BhzHVV4aQ)

### Basic starter

- clean `root.tsx`
- export default App
- Create [Document](https://github.com/jinyongnan810/remix-demo/commit/7c070fb6e9fab2b92f7b709151254ab9bbbc1ff3) to wrap contents
- Create [Layout](https://github.com/jinyongnan810/remix-demo/commit/847b64996babeb708bb037b385f70e32873267ee) to wrap main contents
- Apply [css](https://github.com/jinyongnan810/remix-demo/commit/a6c2237099bf490a40a5cec40bf256828ad6b2b6) & [meta](https://github.com/jinyongnan810/remix-demo/commit/38c56b3062843cd5c109a2b8221b7881e48aae03)

### Remix essentials

- File-based [routing](https://github.com/jinyongnan810/remix-demo/commit/c72fb2e838b3415a0a936b3e5563596a6a24a9f9)
- [Loader](https://github.com/jinyongnan810/remix-demo/commit/d20c1d438f32b22b169c022fa683dcd7db642c90) to load page's data
- [Action](https://github.com/jinyongnan810/remix-demo/commit/8f2ed5f101cc448ddad7d92b7527787d8191df46) to execute page's actions
- [ErrorBoundary](https://github.com/jinyongnan810/remix-demo/commit/10978cd15320ac91706f592b40f1c66e27069c9d) to catch error & show proper ui

### Database Interactions

- [Prisma preparation](https://github.com/jinyongnan810/remix-demo/commit/7510d4891ca918ea0e0d713cd24f2fb10904fa2b)

```bash
npm i prisma @prisma/client
npx prisma init --datasource-provider sqlite
# after setting model fields
npx prisma db push
# create seed in database
npm run db-seed
# check out db with
npx prisma studio
```

- Get db [client](https://github.com/jinyongnan810/remix-demo/commit/018bc08f3867ad970f5d8c3dc72388057c935da8)
- [CRD](https://github.com/jinyongnan810/remix-demo/commit/b9b3ab97efec612c2b178153db407b6c9f1ef453) operations
- [Update](https://github.com/jinyongnan810/remix-demo/commit/85090720013ae2f25a28f6cdd991d94862b11333) Options
