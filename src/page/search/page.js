import {Component} from 'react';
import { SearchBar, WhiteSpace, NavBar, Icon, Switch  } from 'antd-mobile';
import styles from './page.less';
import request from "../../utils/request";
import List from './ItemList'
import asc from '../../assets/asc.svg'
import desc from '../../assets/desc.svg'
import sort from '../../assets/sort.svg'


class Search extends Component {

  state={
    value: '',
    sortBy: 'multiple',
    hasCoupon: true,

    clearList: true,
    searchFocus: false,
  }

  getItemList =(values)=>{
    console.warn('values',values)
    const params ={
      pageNo: 1,
      pageSize: 10,
      sortBy: this.state.sortBy,
      hasCoupon: this.state.hasCoupon,
      title: this.state.value
    }
    request({url: "/api/rebate/queryRebate.htm",method:"post",params:{...params, ...values}}).then(({data:{code, desc, ...data}})=>{
      this.setState({
        itemList: data
      })
    })
  }

  getQueryList=()=>{
    request({url: "/api/rebate/queryTitles.htm",method:"post",params:{title: this.state.value}}).then(({data:{code, desc, data}})=>{
      this.setState({
        queryList: data
      })
    })
  }

  getNewList=(values)=>{
    this.setState({
      clearList: true,
    }, ()=>{
      this.getItemList(values)
    })
  }


  onChange= (value) => {
    this.setState({ value }, this.getQueryList);
  };

  render(){

    const { itemList={},queryList=[], value, sortBy, hasCoupon, clearList, searchFocus } = this.state
    const {totalCount = 0, pageNo = 1, pageSize =10, data:list=[]} = itemList

    const Sort=()=>{

      const sortMenu=[{
        title: '综合排序',
        key: 'multiple'
      },{
        title: '返利比率',
        key: 'commissionRate'
      },{
        title: '价格',
        key: 'viewPrice'
      },{
        title: '销量',
        key: 'soldVolume'
      },]

      let priceSvg = sort;
      if(sortBy==='viewPriceAsc'){
        priceSvg = asc
      }else if(sortBy==='viewPriceDesc'){
        priceSvg = desc
      }

      return(
        <div className={`${styles.filter}`}>
          {
            sortMenu.map(({title, key})=>{
              if(key==='viewPrice'){
                return(
                  <span key={key}
                        className={`${sortBy.substr(0,9)===key?styles["filter-choose"]:""}`}
                        onClick={()=>{
                          let priceSort='viewPriceAsc'
                          if(sortBy==='viewPriceAsc'){
                            priceSort='viewPriceDesc'
                          }
                          this.setState({
                            sortBy: priceSort
                          }, ()=>{
                            this.getNewList()
                          })
                        }}>
                        <div className={styles["filter-price-label"]}>{title}</div>
                        <div className={styles["filter-price-img"]}>
                           <img src={priceSvg}  />
                        </div>

                  </span>
                )
              }
              return(
                <span key={key}
                      className={sortBy===key?styles["filter-choose"]:""}
                      onClick={()=>{
                        if(sortBy===key){
                          return false
                        }
                        this.setState({
                          sortBy: key
                        }, ()=>{
                          this.getNewList()
                        })
                      }}>{title}</span>
              )
            })
          }
        </div>)
    }

    const ItemList=(
      <div style={{display: searchFocus?'none':'block'}}>
        <Sort />
        <div className={styles["filter-coupon"]}>
          <span>仅显示优惠券商品</span>
          <div className={styles["query-switch"]}>
            <Switch checked={hasCoupon}
                    color={'#ff8919'}
                    className={`am-switch my-switch`}
                    onChange={(value)=>{
                      this.setState({
                        hasCoupon: value
                      }, this.getNewList)
                    }}/>
          </div>
        </div>
        <div className={styles["item-list"]}>
          <List list={list}
                total={totalCount}
                clear={clearList}
                onQuery={(pageAdd=false)=>{
                  if(pageAdd) {
                    this.setState({
                      clearList: false
                    }, ()=>{
                      this.getItemList({pageNo: pageNo+1})
                    })
                  }else {
                    this.getItemList()
                  }
                }}/>
        </div>
      </div>
    )

    const SearchList=(
      <div className={styles.queryList} style={{display: searchFocus?'block':'none'}}>
        {
          queryList.map((item, index)=>{
            return(
              <p key={index}
                 className={styles["query-item"]}
                 onClick={()=>{
                   this.setState({
                     searchFocus: false,
                     value:item
                   }, ()=>{
                     this.getNewList()
                   })
                 }}>{item}</p>
            )
          })
        }
      </div>
    )


    return (
      <div className={styles.search}>
        <div>
          <NavBar
            mode="light"
            //icon={<Icon type="left" />}
            //onLeftClick={() => console.log('onLeftClick')}
          >宝贝搜索</NavBar>
        </div>
        <div>
          <SearchBar
            className="am-search my-search"
            placeholder="关键字"
            value={value}
            onFocus={() => {
              this.setState({searchFocus: true, clearList: false});
              this.getQueryList()
            }}
            onSubmit={()=>{
              this.setState({
                searchFocus: false,
              }, ()=>{
                this.getNewList()
              })
            }}
            onCancel={()=>this.setState({searchFocus: false, clearList: false})}
            onChange={this.onChange}/>
        </div>
        {SearchList}
        {ItemList}

      </div>

    );
  }

}


export default Search;
