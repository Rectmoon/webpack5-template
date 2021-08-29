import React from 'react'
import Picture1 from '@/assets/images/1.png'
import Picture2 from '@/assets/images/2.png'
import Picturem from '@/assets/images/m.png'
import style from './index.modules.less'

export default function Banner () {
  return (
    <div className={style.banner}>
      <div className={style.container}>
        <h2>不走loader</h2>
        <div className='flex'>
          <img src={`${ASSETS_ROOT_PREFIX}/images/1.png`} alt='' />
          <img src={`${ASSETS_ROOT_PREFIX}/images/2.png`} alt='' />
          <img src={`${ASSETS_ROOT_PREFIX}/images/m.png`} alt='' />
        </div>
      </div>
      <hr />
      <br />
      <div className={style.container}>
        <h2>走loader</h2>
        <div className='flex'>
          <img src={Picture1} alt='' />
          <img src={Picture2} alt='' />
          <img src={Picturem} alt='' />
        </div>
      </div>
    </div>
  )
}
