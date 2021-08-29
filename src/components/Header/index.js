import React from 'react'
import clx from 'classnames'
import '@/assets/css/flex.css'
import style from './index.modules.css'

export default function Header () {
  return <header className={clx(style.header, 'flex')}>Header</header>
}
