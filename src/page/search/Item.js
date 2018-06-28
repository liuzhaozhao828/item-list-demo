import React from 'react'
import styles from './page.less'
import share from '../../assets/share.svg'
import tianmao from '../../assets/tm.svg'
import request from '../../utils/request';

function Item({item}){

  const Coupon = ({value}) =>{
    return(<div className={styles.coupon}>
      <span>券</span>
      <span>{value}元</span>
    </div>)
  }

  const {image, title, shareUrl, viewPrice, soldVolume, priceByCoupon, couponsLeft, couponAmount, profit } = item
  return(
      <div className={styles.item} onClick={()=>{
        request({url: "/api/rebate/getJumpPage.htm",method:"post",params:{image, title, shareUrl}}).then(({data:{code, desc, jumpPage}})=>{
          if(jumpPage){
            window.location.href=jumpPage
          }
        })

      }}>
        <img src={image} alt={title} className={styles.img}/>
        <div className={styles.detail}>
          <p className={styles["detail-title"]}>
            <img src={tianmao} />
            {title}
          </p>
          <p className={styles["detail-info"]}><span>现价：{viewPrice}</span>{`  `}<span>已售：{soldVolume}</span></p>
          {
            parseInt(couponAmount)>0 &&
            <p className={styles["detail-info"]}><span>券后价: </span><span className={styles['detail-info-price']}>{priceByCoupon}</span></p>
          }
          {
            parseInt(couponAmount)>0 &&
            <Coupon value={couponAmount}/>
          }
          {
            parseInt(couponAmount)>0 &&
            <span className={styles["detail-info"]}>剩余{couponsLeft}张</span>
          }

        </div>
        <div className={styles.share}>
          <div className={styles["share-box"]}>
            <img src={share} />
          </div>
          <p>省 ￥{profit}</p>
        </div>
      </div>
    )

}

export default Item

