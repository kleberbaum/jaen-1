import {
  Input,
  Heading,
  Box,
  Stack,
  Divider,
  Flex,
  Textarea,
  Badge,
  Spacer,
  Image
} from '@chakra-ui/react'
import {useLanguageModeValue} from '@src/language-mode'
import {ChangeEvent, useEffect, useState} from 'react'
import * as React from 'react'

import translations from './translations.json'

type Values = Partial<{
  title: string
  description: string
  siteUrl: string
  image: string
  author: {
    name: string
  }
  organization: {
    name: string
    url: string
    logo: string
  }
  social: {
    twitter: string // twitter username
    fbAppID: string // FB ANALYTICS
    google: string // GOOGLE ANALYTICS
  }
  lastPublished: string
}>

export type SiteSettingsType = {
  values?: Values
  onValuesChange: (newValues: Values) => void
  onImageClick: () => void
}

const SiteSettings: React.FC<SiteSettingsType> = props => {
  const [values, setValues] = useState<Values>(props.values || {})

  useEffect(() => {
    setValues(props.values || {})
  }, [props.values])

  const handleValuesChange = (
    key: keyof Values,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues({...values, [key]: event.target.value})
  }

  const handleValuesCb = () => {
    if (JSON.stringify(values) !== JSON.stringify(props.values)) {
      props.onValuesChange(values)
    }
  }

  const CONTENT = useLanguageModeValue(translations)

  return (
    <>
      <Stack spacing="24px" h="70vh">
        <Flex>
          <Box d="flex">
            <Heading size="lg"> {CONTENT.heading}</Heading>
          </Box>
          <Spacer />
          <Box>
            {values.lastPublished && (
              <Badge variant="outline" colorScheme="blue">
                {CONTENT.lastpublished} {values.lastPublished}
              </Badge>
            )}
          </Box>
        </Flex>
        <Divider />
        <Stack spacing={2}>
          <Flex>
            <Box flex="1" mr={5}>
              <Box py={2}>
                <Flex>
                  <Heading size="md">{CONTENT.title}</Heading>
                  {/* <Tooltip
                    hasArrow
                    label={CONTENT.titletooltip}
                    placement="top-start"
                    fontSize="md">
                    <InfoOutlineIcon w={3.5} h={3.5} ml="1" mt="1" />
                  </Tooltip> */}
                </Flex>
                <Input
                  placeholder="My title"
                  value={values.title || ''}
                  onChange={e => handleValuesChange('title', e)}
                  onBlur={handleValuesCb}
                />
              </Box>
              <Box py={2}>
                <Flex>
                  <Heading size="md">URL</Heading>
                  {/* <Tooltip
                    hasArrow
                    label={CONTENT.urltooltip}
                    placement="top-start"
                    fontSize="md">
                    <InfoOutlineIcon w={3.5} h={3.5} ml="1" mt="1" />
                  </Tooltip> */}
                </Flex>
                <Input
                  placeholder="My slug"
                  value={values.siteUrl || ''}
                  onChange={e => handleValuesChange('siteUrl', e)}
                  onBlur={handleValuesCb}
                />
              </Box>
              <Box py={2}>
                <Flex>
                  <Heading size="md">{CONTENT.description}</Heading>
                  {/* <Tooltip
                    hasArrow
                    label={CONTENT.descriptiontooltip}
                    placement="top-start"
                    fontSize="md">
                    <InfoOutlineIcon w={3.5} h={3.5} ml="1" mt="1" />
                  </Tooltip> */}
                </Flex>
                <Textarea
                  placeholder="Description"
                  maxH="sm"
                  value={values.description || ''}
                  onChange={e => handleValuesChange('description', e)}
                  onBlur={handleValuesCb}
                />
              </Box>
              <Box py={2}>
                <Flex>
                  <Heading size="md">{CONTENT.author}</Heading>
                  {/* <Tooltip
                    hasArrow
                    label={CONTENT.authortooltip}
                    placement="top-start"
                    fontSize="md">
                    <InfoOutlineIcon w={3.5} h={3.5} ml="1" mt="1" />
                  </Tooltip> */}
                </Flex>
                <Box p={2}>
                  <Heading size="sm">Name</Heading>
                  <Input
                    placeholder="John Doe"
                    value={values.author?.name || ''}
                    onChange={e =>
                      setValues({
                        ...values,
                        author: {
                          name: e.target.value
                        }
                      })
                    }
                    onBlur={handleValuesCb}
                  />
                </Box>
              </Box>
              <Box py={2}>
                <Flex>
                  <Heading size="md">{CONTENT.organization}</Heading>
                  {/* <Tooltip
                    hasArrow
                    label={CONTENT.organizationtooltip}
                    placement="top-start"
                    fontSize="md">
                    <InfoOutlineIcon w={3.5} h={3.5} ml="1" mt="1" />
                  </Tooltip> */}
                </Flex>
                <Box p={2}>
                  <Heading size="sm">Name</Heading>
                  <Input
                    placeholder="Example, Inc."
                    value={values.organization?.name || ''}
                    onChange={e =>
                      setValues({
                        ...values,
                        organization: {
                          name: e.target.value,
                          url: values.organization?.url || '',
                          logo: values.organization?.logo || ''
                        }
                      })
                    }
                    onBlur={handleValuesCb}
                  />
                </Box>
                <Box p={2}>
                  <Heading size="sm">URL</Heading>
                  <Input
                    placeholder="https://example.com"
                    value={values.organization?.url || ''}
                    onChange={e =>
                      setValues({
                        ...values,
                        organization: {
                          name: values.organization?.name || '',
                          url: e.target.value,
                          logo: values.organization?.logo || ''
                        }
                      })
                    }
                    onBlur={handleValuesCb}
                  />
                </Box>
                <Box p={2}>
                  <Heading size="sm">Logo</Heading>
                  <Input
                    placeholder="https://example.com"
                    value={values.organization?.logo || ''}
                    onChange={e =>
                      setValues({
                        ...values,
                        organization: {
                          name: values.organization?.name || '',
                          url: values.organization?.url || '',
                          logo: e.target.value
                        }
                      })
                    }
                    onBlur={handleValuesCb}
                  />
                </Box>
              </Box>
            </Box>
            <Box>
              <Image
                h="sm"
                w="sm"
                src={values.image}
                fallbackSrc="https://i.ibb.co/J2jzkBx/placeholder.jpg"
                transition="0.2s all"
                objectFit="cover"
                _hover={{filter: 'brightness(70%)', cursor: 'pointer'}}
                onClick={() => {
                  handleValuesCb()
                  props.onImageClick()
                }}
              />
            </Box>
          </Flex>
        </Stack>
      </Stack>
    </>
  )
}

export default SiteSettings
