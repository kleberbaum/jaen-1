import {ChakraProvider, extendTheme} from '@chakra-ui/react'
import * as buffer from 'buffer'
// import {PageTree} from '@snek-at/jaen-shared-ui'
import {StaticQuery, graphql} from 'gatsby'
import {createContext, useContext} from 'react'
import {Provider as ReduxProvider} from 'react-redux'
import * as ts from 'typescript'

import {merge} from '../common/utils'
import {store, useAppSelector} from '../store'
import {withStorageManager} from '../store/localStorage'
import {DesignProvider} from '../tools/chakra-ui'
import {JaenTemplate, PageMetadata, PageType, ResolvedPageType} from '../types'
import {SiteType} from '../types'

type CMSContextType = {
  site: SiteType
  templates: JaenTemplate[]
}

const CMSContext = createContext<CMSContextType | undefined>(undefined)

export const useCMSContext = (): CMSContextType => {
  const context = useContext(CMSContext)

  if (context === undefined) {
    throw new Error('useCMSContext must be within CMSContext')
  }

  return context
}

export const usePage = (id: string): ResolvedPageType => {
  const context = useCMSContext()
  const storePages = useAppSelector(state => state.site.allSitePage)

  const nodes = context.site.allSitePage.nodes
  const cNode = merge(nodes[id], storePages?.nodes?.[id] || {}) as PageType

  let resolvedPage = ({...cNode} as unknown) as ResolvedPageType

  resolvedPage.parent = cNode.parent ? {page: nodes[cNode.parent.id]} : null

  resolvedPage.children = cNode.children.map(child => ({
    page: nodes[child.id]
  }))

  return resolvedPage
}

export const useCMSPage = (id: string): ResolvedPageType => {
  const pages = useAllSitePage()

  const nodes = pages.nodes
  const cNode = nodes[id]

  let resolvedPage = ({...cNode} as unknown) as ResolvedPageType

  resolvedPage.parent = cNode.parent ? {page: nodes[cNode.parent.id]} : null

  resolvedPage.children = cNode.children.map(child => ({
    page: nodes[child.id]
  }))

  return resolvedPage
}

export const useSiteMetadata = () => {
  const context = useCMSContext()
  const storeSiteMetadata = useAppSelector(state => state.site.siteMetadata)

  return merge(context.site.siteMetadata, storeSiteMetadata || {})
}

export const useAllSitePage = () => {
  const context = useCMSContext()
  const storePages = useAppSelector(state => state.site.allSitePage)

  return merge(
    context.site.allSitePage,
    storePages || {},
    v => v.deleted
  ) as typeof context.site.allSitePage
}

type CMSProviderType = {
  templates: JaenTemplate[]
}

export const CMSProvider: React.FC<CMSProviderType> = ({
  children,
  ...props
}) => {
  // Perf: Querying all the CMS pages in the CMSProvider may be slow, although it's
  // the fastest implementation. In future the PageProvider itself should query
  // its page content along with children and parent page.

  return (
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
              image
              author {
                name
              }
              organization {
                name
                url
                logo
              }
              social {
                twitter
                fbAppID
              }
            }
          }
          jaenPageRootIds: allJaenPage(filter: {parent: {id: {eq: null}}}) {
            distinct(field: id)
          }
          sitePageRootIds: allSitePage(filter: {parent: {id: {eq: null}}}) {
            distinct(field: id)
          }
          allJaenPage {
            allPaths: distinct(field: path)
            nodes {
              id
              slug
              path
              template
              parent {
                id
              }
              children {
                id
              }
              pageMetadata {
                title
                description
                image
                canonical
                datePublished
                social {
                  twitter
                  fbAppId
                }
                isBlogPost
              }
            }
          }
          allSitePage {
            nodes {
              path
              id
              title: internalComponentName
              parent {
                id
              }
              children {
                id
              }
            }
          }
        }
      `}
      render={({
        site: {siteMetadata},
        allJaenPage,
        allSitePage,
        jaenPageRootIds,
        sitePageRootIds
      }) => {
        const structure = allJaenPage as {
          allPaths: string[]
          nodes: (PageType & {id: string})[]
        }

        const staticNodes = allSitePage.nodes.filter(
          (node: any) => !structure.allPaths.includes(node.path)
        ) as (PageType & {id: string})[]

        const site: SiteType = {
          siteMetadata,
          allSitePage: {
            rootNodeIds: jaenPageRootIds.distinct.concat(
              sitePageRootIds.distinct
            ),
            nodes: {}
          }
        }

        site.allSitePage.rootNodeIds = []

        for (const {id, ...node} of structure.nodes.concat(staticNodes)) {
          site.allSitePage.nodes[id] = node
        }

        return (
          <CMSContext.Provider
            value={{
              site,
              templates: props.templates
            }}>
            {children}
          </CMSContext.Provider>
        )
      }}
    />
  )
}
