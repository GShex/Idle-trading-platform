var util = require('../../style/util.js');
const innerAudioContext = wx.createInnerAudioContext()
const app = getApp();
const FATAL_REBUILD_TOLERANCE = 10
const SETDATA_SCROLL_TO_BOTTOM = {
  scrollTop: 100000,
  scrollWithAnimation: true,
}
const recorderManager = wx.getRecorderManager()
Component({
  properties: {
    envId: String,
    collection: String,
    groupId: String,
    groupName: String,
    userInfo: Object,
    onGetUserInfo: {
      type: Function,
    },
    getOpenID: {
      type: Function,
    },
    backgroundimage:String,

  },

  data: {
    listening:false,
    recording:false,
    chats: [],
    textInputValue: '',
    userId: '',
    groupId:'',
    scrollTop: 0,
    scrollToMessage: '',
    hasKeyboard: false,
    record:false,
  },

  methods: {
    onGetUserInfo(e) {
      this.properties.onGetUserInfo(e)
    },

    getOpenID() { 
      console.log(this.properties.getOpenID())
      return this.properties.getOpenID() 
    },

    mergeCommonCriteria(criteria) {
      return {
        //groupId是你这个聊天室的名字，
        //自己可以利用Id给每个卖家创建一下之类的，用id当名字
        //同一个卖家的大家都进到这个聊天室中

        //或者商品一开始上传的时候给他带一个属性就是聊太的属性就行，正好也可以当作评论的属性
        groupId: this.data.groupId,
        ...criteria,//将一个数组转换成用逗号分割的参数序列
      }
    },

    async initRoom() {
      this.try(async () => {
        await this.initOpenID()
        const { envId, collection } = this.properties
        const db = this.db = wx.cloud.database({
          env: envId,
        })
        this.setData({
          groupId: this.properties.groupId,
        })
       // console.log('groupId',this.data.groupId)
        //console.log('pgroupId',this.properties.groupId)
        const _ = db.command
        //这里是获得聊天记录将序排列
        const { data: initList } = await db.collection(collection).where(this.mergeCommonCriteria()).orderBy('sendTimeTS', 'desc').get()
        //const { data: initList } = await db.collection(collection).where({groupId: '6e404dda55d0bdeb866d59d1d5ece63c0f532f2ac957119f4f377d760f93ca69'}).orderBy('sendTimeTS', 'desc').get()
        console.log('init query chats', initList)

        this.setData({
          chats: initList.reverse(),//升序
          scrollTop: 10000,
        })

        this.initWatch(initList.length ? {//这个等于监听后续发送的消息，因为sendTimeTS必然大于消息记录中的TS
          sendTimeTS: _.gt(initList[initList.length - 1].sendTimeTS),
        } : {})
      }, '初始化失败')
    },

    async initOpenID() {
      return this.try(async () => {
        //const userId = await this.getOpenID()
        const userId = app.globalData.userId
        this.setData({
          userId,
        })
      }, '初始化 userId 失败')
    },

    async initWatch(criteria) {
      this.try(() => {
        const { envId, collection } = this.properties
        const db = this.db = wx.cloud.database({
          env: envId,
        })
        const _ = db.command

        console.warn(`开始监听`, criteria)
        this.messageListener = db.collection(collection).where(this.mergeCommonCriteria(criteria)).watch({
          onChange: this.onRealtimeMessageSnapshot.bind(this),//这里在发生变化时会用snapshot作为参数嗲用执行这一函数
          onError: e => {
            if (!this.inited || this.fatalRebuildCount >= FATAL_REBUILD_TOLERANCE) {
              this.showError(this.inited ? '监听错误，已断开' : '初始化监听失败', e, '重连', () => {
                this.initWatch(this.data.chats.length ? {
                  sendTimeTS: _.gt(this.data.chats[this.data.chats.length - 1].sendTimeTS),
                } : {})
              })
            } else {
              this.initWatch(this.data.chats.length ? {
                sendTimeTS: _.gt(this.data.chats[this.data.chats.length - 1].sendTimeTS),
              } : {})
            }
          },
        })
      }, '初始化监听失败')
    },

    onRealtimeMessageSnapshot(snapshot) {
      console.warn(`收到消息`, snapshot)

      if (snapshot.type === 'init') {
        this.setData({
          chats: [
            ...this.data.chats,
            ...[...snapshot.docs].sort((x, y) => x.sendTimeTS - y.sendTimeTS),
          ],
        })
        this.scrollToBottom()
        this.inited = true
      } else {
        let hasNewMessage = false
        let hasOthersMessage = false
        const chats = [...this.data.chats]
        for (const docChange of snapshot.docChanges) {
          switch (docChange.queueType) {
            case 'enqueue': {//增加了聊天内容
              hasOthersMessage = docChange.doc._userid !== this.data.userId
              const ind = chats.findIndex(chat => chat._id === docChange.doc._id)
              if (ind > -1) {
                if (chats[ind].msgType === 'image' && chats[ind].tempFilePath) {
                  chats.splice(ind, 1, {
                    ...docChange.doc,
                    tempFilePath: chats[ind].tempFilePath,
                  })
                } else chats.splice(ind, 1, docChange.doc)
              } else {
                hasNewMessage = true
                chats.push(docChange.doc)
              }
              break
            }
          }
        }
        this.setData({
          chats: chats.sort((x, y) => x.sendTimeTS - y.sendTimeTS),
        })
        if (hasOthersMessage || hasNewMessage) {
          this.scrollToBottom()
        }
      }
    },

    async onConfirmSendText(e) {
      this.try(async () => {
        if (!e.detail.value) {
          return
        }

        const { collection } = this.properties
        const db = this.db
        const _ = db.command

        const doc = {
          _id: `${Math.random()}_${Date.now()}`,
          groupId: this.data.groupId,
          _userid: this.data.userId,
          avatar: this.data.userInfo.avatarUrl,
          nickName: this.data.userInfo.nickName,
          msgType: 'text',
          textContent: e.detail.value,
          sendTime: util.formatTime(new Date()),
          sendTimeTS: Date.now(), // fallback
        }

        this.setData({
          textInputValue: '',
          chats: [
            ...this.data.chats,
            {
              ...doc,
              _userid: this.data.userId,
              writeStatus: 'pending',
            },
          ],
        })
        this.scrollToBottom(true)

        await db.collection(collection).add({
          data: doc,
        })

        this.setData({
          chats: this.data.chats.map(chat => {
            if (chat._id === doc._id) {
              return {
                ...chat,
                writeStatus: 'written',
              }
            } else return chat
          }),
        })
      }, '发送文字失败')
    },
    //发送语音
  //   async yuyin(e) {
  //     this.setData({
  //       recording:true
  //     })
  //     const options = {
  //       duration: 5000, //指定录音的时长，单位 ms，最大为10分钟（600000），默认为1分钟（60000）
  //       sampleRate: 16000, //采样率
  //       numberOfChannels: 1, //录音通道数
  //       encodeBitRate: 96000, //编码码率
  //       format: 'mp3', //音频格式，有效值 aac/mp3
  //       frameSize: 50, //指定帧大小，单位 KB
  //     }
  //     //开始录音
  //     recorderManager.start(options);
  //     recorderManager.onStart(() => {
  //       console.log('。。。开始录音。。。')
  //     });
  //   },
  //   async stop(){
  //     this.setData({
  //       recording:false
  //     })
  //     console.log('。。。停止录音了。。。')
  //     recorderManager.stop();
  //     recorderManager.onStop((res) => {
  //       console.log('录音文件',res.tempFilePath)
  //       this.setData({
  //         tempFilePathrecord:res.tempFilePath
  //       })
  //       this.sendrecord()
  //     })
  //   },
  //   async sendrecord(e){

  //         const { envId, collection } = this.properties
  //         const doc = {
  //           _id: `${Math.random()}_${Date.now()}`,
  //           groupId: this.data.groupId,
  //           avatar: this.data.userInfo.avatarUrl,
  //           nickName: this.data.userInfo.nickName,
  //           msgType: 'record',
  //           sendTime: util.formatTime(new Date()),
  //           sendTimeTS: Date.now(), // fallback
  //         }

  //         this.setData({
  //           chats: [
  //             ...this.data.chats,
  //             {
  //               ...doc,
  //               _userid: this.data.userId,
  //               tempFilePath: this.data.tempFilePathrecord,
  //               writeStatus: 0,
  //             },
  //           ]
  //         })
  //         this.scrollToBottom(true)

  //         const uploadTask = wx.cloud.uploadFile({
  //           cloudPath: `录音/${this.data.groupId}/${this.data.userInfo.nickName}/${Math.random()}_${Date.now()}.${this.data.tempFilePathrecord.match(/\.(\w+)$/)[1]}`,
  //          // cloudPath: 'record.mp3',
  //           filePath: this.data.tempFilePathrecord,
  //           config: {
  //             env: envId,
  //           },
  //           success: res => {
  //             this.try(async () => {
  //               await this.db.collection(collection).add({
  //                 data: {
  //                   ...doc,
  //                   recordID: res.fileID,
  //                 },
  //               })
  //             }, '发送录音失败')
  //           },
  //           fail: e => {
  //             this.showError('发送录音失败', e,'','')
  //           },
  //         })

  //         uploadTask.onProgressUpdate(({ progress }) => {
  //           this.setData({
  //             chats: this.data.chats.map(chat => {
  //               if (chat._id === doc._id) {
  //                 return {
  //                   ...chat,
  //                   writeStatus: progress,
  //                 }
  //               } else return chat
  //             })
  //           })
  //         })

  //   },
  //   async play(e){
  //     if(this.data.listening){
  //       this.setData({
  //         listening:false
  //       })
  //       innerAudioContext.pause()
  //     }
  //     else{
  //       this.setData({
  //         listening:true
  //       })

  //     console.log('点击了播放')
  //     var tempsound=e.currentTarget.dataset.file
  //     var arr=[]
  //     arr.push(tempsound)
  //     console.log(arr)
  //     wx.cloud.downloadFile({
  //       fileID: tempsound, //音频文件url              
  //       success: res => {    
  //         wx.cloud.getTempFileURL({
  //           fileList:arr,
  //           success: res => {
  //             console.log(res)

  //             innerAudioContext.autoplay = true
  //             innerAudioContext.src = res.fileList[0].tempFileURL
  //             innerAudioContext.onPlay(() => {
  //             console.log('开始播放1')
  //             })
  //           },
  //           fail: err => {
  //             console.log('播放错误',err)
  //           }
  //         })
  //         console.log(res.tempFilePath)         
  //         /*
  //             if (res.statusCode === 200) {                
  //                   wx.playVoice({              
  //                        filePath: res.tempFilePath,                      
  //                         complete: (e) => {    
  //                           console.log('完成',e) 
  //                           wx.getFileSystemManager().saveFile({
  //                             tempFilePath: res.tempFilePath,
  //                             success: function(res) {
  //                               console.log(res)
  //                               console.log('保存到本地')
  //                             }
  //                           })         
  //                         }
  //                   });
  //              }
  //              */
  //       }
  //       ,fail(e){
  //         console.log(e)
  //       }
  // });
  // }//else组件的反括号
  //   },
  //   async file(e){
  //     wx.chooseMessageFile({
  //       count: 1,
  //       type: 'file',
  //       success: async res => {
  //         console.log('文件：',res)
  //         this.setData({
  //           filename:res.tempFiles[0].name
  //         })

  //           const { envId, collection } = this.properties
  //           const doc = {
  //             _id: `${Math.random()}_${Date.now()}`,
  //             groupId: this.data.groupId,
  //             avatar: this.data.userInfo.avatarUrl,
  //             nickName: this.data.userInfo.nickName,
  //             msgType: 'file',
  //             sendTime: util.formatTime(new Date()),
  //             sendTimeTS: Date.now(), // fallback
  //           }
  
  //           this.setData({
  //             chats: [
  //               ...this.data.chats,
  //               {
  //                 ...doc,
  //                 _userid: this.data.userId,
  //                 tempFilePath: res.tempFiles[0].path,
  //                 writeStatus: 0,
  //               },
  //             ]
  //           })
  //           this.scrollToBottom(true)

  //           console.log('文件的信息:',res.tempFiles[0].path)
  //           console.log('文件的名字:',res.tempFiles[0].name)
  //           const uploadTask = wx.cloud.uploadFile({
  //             cloudPath: `文件传输/${this.data.groupId}/${this.data.userInfo.nickName}/${Math.random()}_${Date.now()}.${res.tempFiles[0].path.match(/\.(\w+)$/)[1]}`,
  //             filePath: res.tempFiles[0].path,
  //             config: {
  //               env: envId,
  //             },
  //             success: res => {
  //               this.try(async () => {
  //                 console.log(this.data.filename)
  //                 await this.db.collection(collection).add({
  //                   data: {
  //                     ...doc,
  //                     FileID: res.fileID,
  //                     filename:this.data.filename
  //                   },
  //                 })
  //               }, '发送文件失败')
  //             },
  //             fail: e => {
  //               this.showError('发送文件失败', e,'','')
  //             },
  //           })
  
  //           uploadTask.onProgressUpdate(({ progress }) => {
  //             this.setData({
  //               chats: this.data.chats.map(chat => {
  //                 if (chat._id === doc._id) {
  //                   return {
  //                     ...chat,
  //                     writeStatus: progress,
  //                   }
  //                 } else return chat
  //               })
  //             })
  //           })
     
  //       }
  //     })
  //   },
  //   async downloadfile(e){
  //     var fileID=e.currentTarget.dataset.file
  //       let that = this;
  //       wx.cloud.getTempFileURL({
  //         fileList: [fileID],
  //         success: res => {
  //           // get temp file URL
  //           console.log("文件下载链接", res.fileList[0].tempFileURL)
  //           that.setData({
  //             fileUrl: res.fileList[0].tempFileURL,
  //             flag: 1
  //           })
  //           that.downloadFile()
  //         },
  //         fail: err => {
  //           // handle error
  //         }
  //       })
      
  //   },
  //   async   downloadFile() {
  //     let that = this
  //     let url = that.data.fileUrl;
  //     wx.downloadFile({
  //       url: url,
  //       header: {},
  //       success: function (res) {
  //         var filePath = res.tempFilePath;
  //         console.log(filePath);
  //         wx.openDocument({
  //           filePath: filePath,
  //           success: function (res) {
  //             console.log('打开文档成功')
  //           },
  //           fail: function (res) {
  //             console.log(res);
  //           },
  //           complete: function (res) {
  //             console.log(res);
  //           }
  //         })
  //       },
  //       fail: function (res) {
  //         console.log('文件下载失败');
  //       },
  //       complete: function (res) { },
  //     })
  //   },
    
    async onChooseImage(e) {
      wx.chooseImage({
        count: 1,
        sourceType: ['album', 'camera'],
        success: async res => {
          const { envId, collection } = this.properties
          const doc = {
            _id: `${Math.random()}_${Date.now()}`,
            groupId: this.data.groupId,
            avatar: this.data.userInfo.avatarUrl,
            nickName: this.data.userInfo.nickName,
            msgType: 'image',
            sendTime: util.formatTime(new Date()),
            sendTimeTS: Date.now(), // fallback
          }

          this.setData({
            chats: [
              ...this.data.chats,
              {
                ...doc,
                _userid: this.data.userId,
                tempFilePath: res.tempFilePaths[0],
                writeStatus: 0,
              },
            ]
          })
          this.scrollToBottom(true)

          const uploadTask = wx.cloud.uploadFile({
            cloudPath: `办公交流/${this.data.groupId}/${this.data.userInfo.nickName}/${Math.random()}_${Date.now()}.${res.tempFilePaths[0].match(/\.(\w+)$/)[1]}`,
            filePath: res.tempFilePaths[0],
            config: {
              env: envId,
            },
            success: res => {
              this.try(async () => {
                await this.db.collection(collection).add({
                  data: {
                    ...doc,
                    imgFileID: res.fileID,
                  },
                })
              }, '发送图片失败')
            },
            fail: e => {
              this.showError('发送图片失败', e,'','')
            },
          })

          uploadTask.onProgressUpdate(({ progress }) => {
            this.setData({
              chats: this.data.chats.map(chat => {
                if (chat._id === doc._id) {
                  return {
                    ...chat,
                    writeStatus: progress,
                  }
                } else return chat
              })
            })
          })
        },
      })
    },

    onMessageImageTap(e) {
      wx.previewImage({
        urls: [e.target.dataset.fileid],
      })
    },

    scrollToBottom(force) {
      if (force) {
        console.log('force scroll to bottom')
        this.setData(SETDATA_SCROLL_TO_BOTTOM)
        return
      }

      this.createSelectorQuery().select('.body').boundingClientRect(bodyRect => {
        this.createSelectorQuery().select(`.body`).scrollOffset(scroll => {
          if (scroll.scrollTop + bodyRect.height * 3 > scroll.scrollHeight) {
            console.log('should scroll to bottom')
            this.setData(SETDATA_SCROLL_TO_BOTTOM)
          }
        }).exec()
      }).exec()
    },

    async onScrollToUpper() {
      if (this.db && this.data.chats.length) {
        const { collection } = this.properties
        const _ = this.db.command
        const { data } = await this.db.collection(collection).where(this.mergeCommonCriteria({
          sendTimeTS: _.lt(this.data.chats[0].sendTimeTS),
        })).orderBy('sendTimeTS', 'desc').get()
        this.data.chats.unshift(...data.reverse())
        this.setData({
          chats: this.data.chats,
          scrollToMessage: `item-${data.length}`,
          scrollWithAnimation: false,
        })
      }
    },

    async try(fn, title) {
      try {
        await fn()
      } catch (e) {
        this.showError(title, e,'','')
      }
    },

    showError(title, content, confirmText, confirmCallback) {
      console.error(title, content)
      wx.showModal({
        title,
        content: content.toString(),
        showCancel: confirmText ? true : false,
        confirmText,
        success: res => {
          res.confirm && confirmCallback()
        },
      })
    },
  },

  ready() {
    global.chatroom = this
    this.initRoom()
    this.fatalRebuildCount = 0
  },
})
