/**
 * @license
 *
 * SPDX-FileCopyrightText: Copyright © 2021 snek.at
 * SPDX-License-Identifier: EUPL-1.2
 *
 * Use of this source code is governed by an EUPL-1.2 license that can be found
 * in the LICENSE file at https://snek.at/license
 */
import {
  EditOutlined,
  CloudUploadOutlined,
  MenuOutlined,
  DeleteOutlined,
  EditFilled,
  LoginOutlined,
  LogoutOutlined,
  FileImageOutlined
} from '@ant-design/icons'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {AppDispatch, RootState} from '~/store'

import LoginModal from '~/components/modals/Login'

import {login, logout} from '~/store/actions/auth'
import {decryptWDL, discardEditing, toggleEditing} from '~/store/actions/cms'

import SideMenu from './SideMenu'
import SnekFabButton from './SnekFabButton'
import FilesModal from './modals/Files'
import PublishModal from './modals/Publish'
import SiteMenu from './modals/SiteMenu'
import * as S from './style'

const MgmtOverlay: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const [showLoginModal, setShowLoginModal] = useState(false)

  const {loading, authenticated, encryptionToken} = useSelector(
    (state: RootState) => state.auth
  )

  const editing = useSelector((state: RootState) => state.cms.options.editing)

  useEffect(() => {
    dispatch(login({}))
  }, [dispatch])

  useEffect(() => {
    if (authenticated) {
      setShowLoginModal(false)

      if (!loading) {
        dispatch(decryptWDL({encryptionToken}))
      }
    }
  }, [dispatch, authenticated, loading, encryptionToken])

  return (
    <S.MgmtOverlay>
      <SnekFabButton
        fabOptions={[
          authenticated
            ? {
                text: 'Logout',
                icon: <LogoutOutlined />,
                onClick: () => {
                  dispatch(logout())
                  dispatch(toggleEditing(false))
                }
              }
            : {
                text: 'Login',
                icon: <LoginOutlined />,
                onClick: () => setShowLoginModal(true)
              }
        ]}
      />

      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {authenticated && (
        <SideMenu
          items={[
            {
              text: 'Site Menu',
              Icon: MenuOutlined,
              onClick: () => null,
              renderElementOnClick: <SiteMenu />
            },
            {
              text: editing ? 'Preview' : 'Edit',
              Icon: editing ? EditFilled : EditOutlined,
              onClick: () => dispatch(toggleEditing(!editing))
            },
            {
              text: 'Files',
              Icon: FileImageOutlined,
              onClick: () => null,
              renderElementOnClick: <FilesModal onClose={() => null} />
            },
            {
              text: 'Publish',
              Icon: CloudUploadOutlined,
              onClick: () => null,
              renderElementOnClick: <PublishModal />
            },
            {
              text: 'Discard changes',
              Icon: DeleteOutlined,
              onClick: () => dispatch(discardEditing())
            }
          ]}
        />
      )}
    </S.MgmtOverlay>
  )
}

export default MgmtOverlay