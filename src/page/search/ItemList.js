import { ListView, Icon } from 'antd-mobile';
import React from 'react'
import ReactDOM from 'react-dom';
import styles from './page.less'
import Item from './Item'

function MyBody(props) {
  return (
    <div >
      <span style={{ display: 'none' }}>you can custom body wrap element</span>
      {props.children}
    </div>
  );
}


const NUM_SECTIONS = 10;
let pageIndex = 0;

let dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];



class ItemList extends React.Component {
  constructor(props) {
    super(props);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      dataSource,
      isLoading: true,
      height: document.documentElement.clientHeight * 3 / 4,
      data: [],
      hasMore: true
    };
  }

  componentDidMount() {
    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    this.setState({
      height: hei,
    });
    //this.props.onQuery()
  }

  // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
  componentWillReceiveProps(nextProps) {
    //console.warn('nextProps',nextProps)
    const data = this.state.data||[]
    const {list =[], clear=false, total} = nextProps
    if(total=="0"){
      this.setState({
        isLoading: false,
      })
    }
    if(clear){
      this.clear()
    }
    if (list.length!==0 && list !== this.props.list && total>0) {
      setTimeout(() => {
        this.genData(pageIndex++, list.length);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
          isLoading: false,
          data:[...data,...list]
        });
      }, 1000);
    }
  }



  genData = (pIndex = 0, length)=>{
    const {total} = this.props
    let len = NUM_SECTIONS;
    if(length<NUM_SECTIONS||(sectionIDs.length+length>=total)){
      len = length
      this.setState({
        hasMore: false
      })
    }
    for (let i = 0; i < len; i++) {
      const ii = (pIndex * NUM_SECTIONS) + i;
      const sectionName = `Section ${ii}`;
      sectionIDs.push(sectionName);
      dataBlobs[sectionName] = sectionName;
      rowIDs[ii] = [];

      const rowName = `S${ii}`;
      rowIDs[ii].push(rowName);
      dataBlobs[rowName] = rowName;
    }
    sectionIDs = [...sectionIDs];
    rowIDs = [...rowIDs];

  }

  onEndReached = (event) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading || !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);
    this.setState({ isLoading: true });
    this.props.onQuery()

  }

  clear=()=>{
    setTimeout(() => {
      dataBlobs = {};
      sectionIDs = [];
      rowIDs = [];
      pageIndex = 0
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
        isLoading: true,
        data:[]
      });
    }, 0);
  }

  render() {
    const {data:list} = this.state
    const {total} = this.props

    let endText=<Icon type={'loading'} />
    if(total===0){
      endText = "无结果"
    }else {
      endText = this.state.hasMore?(this.state.isLoading ? <Icon type={'loading'} /> : ''):'没有更多内容了'
    }


    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
      />
    );
    let index = NUM_SECTIONS*(pageIndex - 1);
    const row = (rowData, sectionID, rowID) => {
      const obj = list[index++]||{};
      return (
        <div key={rowID}>
          <Item item={obj}/>
        </div>
      );
    };

    return (
      <ListView
        ref={el => this.lv = el}
        dataSource={this.state.dataSource}
        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
          {endText}
        </div>)}
        renderBodyComponent={() => <MyBody />}
        renderRow={row}
        renderSeparator={separator}
        style={{
          height: this.state.height,
          overflow: 'auto',
        }}
        pageSize={4}
        //onScroll={() => { console.log('scroll'); }}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />

    );
  }
}

export default ItemList
