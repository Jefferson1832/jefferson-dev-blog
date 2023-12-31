import Head from 'next/head'
import Image from 'next/image'
import {gql} from "@apollo/client"
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { Header } from '@/components/Header'
import Link from 'next/link'
import { GetStaticPaths, GetStaticProps } from 'next'
import { client } from '@/lab/apollo'
import {RichText} from "@graphcms/rich-text-react-renderer"
import {ElementNode} from "@graphcms/rich-text-types"



const GET_POST = gql`
  query GetPost($slugPost: String) {
    post(where: {slug: $slugPost}) {
      id
      title
      content {
        json
      }
      author {
        name
      }
      createdAt
      coverimage {
        url
      }
    }
  }
`

interface PostProps {
  post: {
    id: string;
    title: string;
    coverimage: {
      url: string;
    };
    author: {
      name: string;
    };
    createdAt: string;
    content: {
      json: ElementNode[]
    }
  }
}

export default function Post({ post }: PostProps) {
    return (
        <>
      <Head>
        <title>BlogTech</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="w-full max-w-[1120px] flex flex-col mx-auto pb-12 px-4">
        <Header />

        <div className='pr-2'>
          <Link
          href={"/"}
          className='flex w-full max-w-fit font-bold text-zinc-900 hover:text-zinc-600 float-right'
          >
              Voltar
          </Link>
        </div>
        <div className='w-full h-full flex-col flex mt-8'>
          <div className='flex w-full h-56 sm:h-88 lg:h-[392px] relative rounded-2xl overflow-hidden'>
            <Image
              src={post.coverimage.url}
              alt=""
              fill={true}
              style={{objectFit: "cover"}}
            />
          </div>          
        </div>

        <div className='flex w-full flex-col mt-4 sm:mt-8'>
            <h1 className='font-bold text-2xl sm:text-4xl lg:text-[40px] text-blue-600'>{post.title}</h1>
            <div>
              <p className='font-bold text-zinc-900'>{post.author.name}</p>
              <p className='text-zinc-600 text-sm'>{format(new Date(post.createdAt), "dd 'de' MMM 'de' yyyy", { locale: ptBR})}</p>
            </div>
            <div className='mt-4 sm:mt-8'>
              <RichText
               content={post.content.json}
               renderers={{
                p: ({ children }) => <p className='text-zinc-600 text-sm sm:text-base text-justify lg:text-left mt-1'>{children}</p>
               }}
               />
            </div>
            {/* <p className='text-zinc-600 mt-4 text-sm sm:text-base text-justify lg:text-left sm:mt-8'></p> */}
          </div>
      </div>

    </>
    )
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug

  const { data } = await client.query({
    query: GET_POST,
    variables: {
      slugPost: slug
    }
  })

  const post = data?.post || null;

  return {
    props: {
      post: data.post
    },
    revalidate: 60 * 30 //30 min
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {params: { slug: 'empreendedorismo-digital-o-caminho-para-a-inovacao-e-o-sucesso-online'}},
    ],
    fallback: 'blocking'
  }
}
