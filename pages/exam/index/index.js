// pages/exam/index/index.js
let app = getApp()
Page({
  data: {
    paperType: 1,
    spinShow: false,
    loadMoreLoad: false,
    loadMoreTip: '暂无数据',
    queryParam: {
      paperType: 1,
      pageIndex: 1,
      pageSize: app.globalData.pageSize
    },
    tableData: [],
    tableData2: [],
    total: 1,
    current: 'tab1',
    current_scroll: 'tab1',
    subjects:[]
  },
  handleChange ({ detail }) {
    this.setData({
        current: detail.key
    });
  },

  handleChangeScroll ({ detail }) {
    this.setData({
        current_scroll: detail.key
    });
    
    if(detail.key==0){
      this.setData({
        tableData: this.data.tableData2
      });
    }else{
      let arr = [];
      for(let i=0;i<this.data.tableData2.length;i++){
          if(detail.key==this.data.tableData2[i].subjectId){
            arr.push(this.data.tableData2[i]);
          }
      }
      this.setData({
        tableData: arr
      });
    }
  },
  onLoad: function(options) {
    this.setData({
      spinShow: true
    });
    this.search(true)
  },
  tabChange({
    detail
  }) {
    this.setData({
      spinShow: true
    });
    let size = app.globalData.pageSize
    this.setData({
      paperType: detail.key,
      queryParam: {
        paperType: detail.key,
        pageIndex: 1,
        pageSize: app.globalData.pageSize
      }
    });
    this.search(true)
  },
  onPullDownRefresh() {
    this.setData({
      spinShow: true
    });
    if (!this.loading) {
      this.setData({
        ['queryParam.pageIndex']: 1
      });
      this.search(true)
    }
  },
  onReachBottom() {
    if (!this.loading && this.data.queryParam.pageIndex < this.data.total) {
      this.setData({
        loadMoreLoad: true,
        loadMoreTip: '正在加载'
      });
      this.setData({
        ['queryParam.pageIndex']: this.data.queryParam.pageIndex + 1
      });
      this.search(false)
    }
  },
  search: function(override) {
    let _this = this
    app.formPost('/api/wx/student/exampaper/pageList', this.data.queryParam).then(res => {
      _this.setData({
        spinShow: false
      });
      wx.stopPullDownRefresh()
      if (res.code === 1) {
        const re = res.response
        _this.setData({
          ['queryParam.pageIndex']: re.pageNum,
          tableData: override ? re.list : this.data.tableData.concat(re.list),
          total: re.pages
        });
        _this.setData({
          tableData2: this.data.tableData
        });
        if(this.data.tableData2.length>0){
          let arr = [];
          let obj = {};
          let dd = this.data.tableData2;
          let myMap = new Map();
          myMap.set(dd[0].subjectId,dd[0].subjectName)
          obj.subjectId = dd[0].subjectId;
          obj.subjectName = dd[0].subjectName;
          arr.push(obj)
          for(let i=1;i<dd.length;i++){
            
            if(!myMap.has(dd[i].subjectId)){
              let obj1 = {};
              myMap.set(dd[i].subjectId,dd[i].subjectName)
              obj1.subjectId = dd[i].subjectId;
              obj1.subjectName = dd[i].subjectName;
              arr.push(obj1)
            }
          }
          this.setData({
            subjects:arr
          });
        }
        if(re.total>0){
          this.setData({
            loadMoreLoad: false,
            loadMoreTip: ''
          });
        }else{
          this.setData({
            loadMoreLoad: false,
            loadMoreTip: '暂无数据'
          });
        }
        // if (re.pageNum >= re.pages) {
        //   this.setData({
        //     loadMoreLoad: false,
        //     loadMoreTip: '暂无数据'
        //   });
        // }
      }
    }).catch(e => {
      _this.setData({
        spinShow: false
      });
      app.message(e, 'error')
    })
  }
})