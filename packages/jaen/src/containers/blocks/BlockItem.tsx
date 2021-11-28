import {SFBWrapper} from '@components/index'
import BlockProvider from '@src/contexts/block'
import {JaenBlock} from '@src/types'
import isEqual from 'lodash/isEqual'
import * as React from 'react'

type BlockItemProps = {
  // block props
  containerName: string
  position: number
  blockName: string
  // other props
  BlockComponent: JaenBlock
  isEditing: boolean
  onDelete: (position: number) => void
}

const BlockItem = React.memo<BlockItemProps>(
  ({children, BlockComponent, isEditing, onDelete, ...blockProps}) => {
    if (!isEditing) {
      return (
        <BlockProvider {...blockProps}>
          <BlockComponent />
        </BlockProvider>
      )
    }

    return (
      <BlockProvider {...blockProps}>
        <SFBWrapper onDeleteClick={() => onDelete(blockProps.position)}>
          <BlockComponent />
        </SFBWrapper>
      </BlockProvider>
    )
  }
)

export default BlockItem
