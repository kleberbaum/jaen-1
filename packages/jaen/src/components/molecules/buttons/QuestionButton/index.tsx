import {IconButton, Tooltip} from '@chakra-ui/react'
import {QuestionIcon} from '@components/atoms/icons'
import {useLanguageModeValue} from '@src/language-mode'
import * as React from 'react'

import translations from './translations.json'

const QuestionButton: React.FC = props => {
  const CONTENT = useLanguageModeValue(translations)

  return (
    <Tooltip
      hasArrow
      label={CONTENT.tooltip}
      placement="bottom-start"
      fontSize="md">
      <IconButton variant="ghost" aria-label="adad" icon={<QuestionIcon />} />
    </Tooltip>
  )
}

export default QuestionButton
