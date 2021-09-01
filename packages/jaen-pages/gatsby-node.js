require('isomorphic-fetch')

const path = require('path')
const fs = require('fs')

const {mergeBaseWithMigration} = require('./src/tools/publish/merge')

exports.onPreBootstrap = async ({graphql, actions}) => {
  const migrationUrl = process.env.JAEN_PAGES_NEW_MIGRATION
  const jaenPagesPath = path.resolve('./jaen-pages.json')

  if (migrationUrl) {
    // get file content fs
    const fileContent = JSON.parse(fs.readFileSync(jaenPagesPath, 'utf8'))
    const migrationFile = await (await fetch(migrationUrl)).json()
    const newBaseData = await mergeBaseWithMigration(fileContent, migrationFile)

    fs.writeFileSync(jaenPagesPath, JSON.stringify(newBaseData, null, 2))
  }
}

exports.onCreatePage = ({page, actions}) => {
  const {createPage, deletePage} = actions

  const jaenPageId = page.context.jaenPageId

  if (!jaenPageId) {
    deletePage(page)
    // You can access the variable "house" in your page queries now
    createPage({
      ...page,
      context: {
        ...page.context,
        jaenPageId: `SitePage ${page.path}`
      }
    })
  }
}

exports.sourceNodes = ({actions, createNodeId, createContentDigest}, p) => {
  const pages = []
  // loop 500 times
  for (let i = 0; i < 2; i++) {
    pages.push({
      slug: 'hello-world' + i,
      path: '/hello-world' + i,
      id: 'hello-world' + i,
      parentId: null,
      childIds: [],
      template: 'SamplePage',
      pageMetadata: {
        title: 'Hello from your world ' + i,
        description: '',
        image: '',
        canonical: 'https://snek.at/hello-world' + i,
        datePublished: '',
        social: {twitter: '', fbAppId: ''},
        isBlogPost: false
      }
    })
  }

  pages.map(page => {
    actions.createNode({
      path: page.path,
      id: page.id,
      slug: page.slug,
      parent: page.parentId,
      children: page.childIds,
      template: page.template,
      pageMetadata: page.pageMetadata,
      internal: {
        type: 'JaenPage',
        contentDigest: createContentDigest(page),
        content: JSON.stringify(page)
      }
    })
  })
}

exports.createPages = async ({graphql, actions}, pluginOptions) => {
  const {createPage} = actions

  const templates = pluginOptions.templates

  const queryResults = await graphql(`
    query AllJaenPages {
      allJaenPage {
        nodes {
          id
          path
          template
        }
      }
    }
  `)

  queryResults.data.allJaenPage.nodes.forEach(node => {
    createPage({
      path: node.path,
      component: path.resolve(templates[node.template]),
      context: {
        jaenPageId: node.id
      }
    })
  })
}
