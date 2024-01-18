import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

type Repo = {
  apiKey: string
  
}

export const getServerSideProps = (async () => {
  const repo: Repo  = {apiKey : process.env.SECRETKEY!}
  return { props: { repo } }
 
}) satisfies GetServerSideProps<{ repo: Repo }>