import {Box, Divider, Flex, Center} from '@chakra-ui/react'
import {PageContent} from '@components/molecules'
import {Values} from '@components/molecules/PageContent'
import PageTree from '@components/molecules/PageTree'
import * as React from 'react'

export type Items = {
  [id: string]: {
    data: Partial<{
      templateName: string | null
      title: string
      slug: string
      description: string
      image: string
      isBlogPost: boolean
      lastPublished?: string
      locked?: boolean
    }>
    children: string[]
    parent: string | null
    deleted?: true
  }
}

export type PageExplorerProps = {
  items: Items
  rootItemIds: string[]
  defaultSelection: string
  templates: string[]
  onItemSelect: (id: string | null) => void
  onItemCreate: (
    parentId: string | null,
    title: string,
    slug: string,
    template: string
  ) => void
  onItemDelete: (id: string) => void
  onItemUpdate: (id: string, newValues: Values) => void
  onItemMove: (id: string, newParentId: string | null) => void
  onItemImageClick: (id: string) => void
}

const PageExplorer: React.FC<PageExplorerProps> = props => {
  const [rootItemIds, setRootItemIds] = React.useState(props.rootItemIds)
  const [items, setItems] = React.useState(props.items)

  const [selectedItem, setSelectedItem] = React.useState<string>(
    props.defaultSelection
  )

  React.useEffect(() => {
    setRootItemIds(props.rootItemIds)
  }, [props.rootItemIds])
  React.useEffect(() => {
    setItems(props.items)
  }, [props.items])

  const getItemValues = (id: string) => {
    const item = props.items[id]

    return {
      templateName: item.data.templateName,
      title: item.data.title,
      slug: item.data.slug,
      description: item.data.description,
      image: item.data.image,
      isBlogPost: item.data.isBlogPost,
      lastPublished: item.data.lastPublished,
      locked: item.data.locked
    }
  }

  const values = selectedItem ? getItemValues(selectedItem) : undefined

  const handleItemSelect = (id: string | null) => {
    setSelectedItem(id || props.defaultSelection)
    props.onItemSelect(id)
  }

  const handleItemDelete = (id: string) => {
    setSelectedItem(props.defaultSelection)

    props.onItemDelete(id)
  }

  return (
    <>
      {/* <Divider mt={4} mb={4} /> */}
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" h="67vh" p={2}>
        <Flex h="65vh">
          <Box paddingRight={5} minW="sm">
            <PageTree
              items={items}
              rootItemIds={rootItemIds}
              defaultSelection={props.defaultSelection}
              templates={props.templates}
              height="100%"
              onItemSelect={handleItemSelect}
              onItemCreate={props.onItemCreate}
              onItemDelete={handleItemDelete}
              onItemMove={props.onItemMove}
            />
          </Box>
          <Center height="65vh">
            <Divider orientation="vertical" />
          </Center>
          <Box flex="1" p={5} overflow="auto">
            <PageContent
              values={values}
              onValuesChange={newValues =>
                selectedItem && props.onItemUpdate(selectedItem, newValues)
              }
              onImageClick={() =>
                selectedItem && props.onItemImageClick(selectedItem)
              }
            />
          </Box>
        </Flex>
      </Box>
    </>
  )
}

export default PageExplorer
