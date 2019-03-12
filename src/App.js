import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Layout, Button, Loading, Message, MessageBox } from 'element-react'
import { BrowserRouter, Route} from 'react-router-dom'
import 'element-theme-default';
class Content extends Component{

  constructor(props) {
    super(props);
    this.state = { serverState:'pending' , date:'20XX-XX-XX',  loading:true, loadingText:'正在同步更新状态'};
    this.refresh().then(()=>{
      this.setState({loading:false})
      this.refreshTimer = setInterval(async ()=>{
        this.refresh()
      }, 3000);
    })
  }


  async refresh(){
    let res = await axios.get('https://myseu.cn/ws3/api/pe/morningExerciseNotification')
    let serverStatus = res.data.result
    this.setState({serverState:serverStatus.state, date:serverStatus.date})
  }

  componentWillUnmount(){
    clearInterval(this.refreshTimer)
  }

  async push(state){

    MessageBox.confirm(`将通知所有用户${state==='set'?'【跑操正常进行】':'【跑操取消】'}, 是否继续?`, '提示', {
      type: 'warning'
    }).then(async () => {
      this.setState({loading:true, loadingText:'正在推送中，请勿刷新页面'})
      let res = await axios.post('https://myseu.cn/ws3/api/pe/morningExerciseNotification',{sessionKey:this.props.match.params.sessionKey, state})
      this.setState({loading:false, serverState:state})
      Message({
        type: res.data.success?'success':'warning',
        message:res.data.success?res.data.result:res.data.reason,
      });
    }).catch(() => {
    });
  }

  render(){
    const stateNameMap = {
      'set':'跑操正常进行',
      'cancel':'跑操取消',
      'pending':'未设置'
    }

    return (
      <div>
        <Layout.Row>
          <Layout.Col span="24"><div className="title">{this.state.date} 跑操提醒状态推送</div></Layout.Col>
        </Layout.Row>
        <Layout.Row>
          <Layout.Col span="24"><div className="hint">当前设置状态</div></Layout.Col>
        </Layout.Row>
        <Layout.Row>
          <Layout.Col span="24">
          <div className="currentState"><div className={this.state.serverState}></div>
          <div className="text">{stateNameMap[this.state.serverState]}</div></div>
          </Layout.Col>
        </Layout.Row>
        <Layout.Row>
          <Layout.Col span="24">
          <div className="button-box">
          <Button plain={true} type="success" disabled={this.loading || this.state.serverState==='set'} onClick={()=>{this.push.bind(this)('set')}}>推送「正常跑操」通知</Button>
          </div>
          </Layout.Col>
        </Layout.Row>
        <Layout.Row>
          <Layout.Col span="24">
          <div className="button-box">
          <Button plain={true} type="danger" disabled={this.loading || this.state.serverState==='cancel'} onClick={()=>{this.push.bind(this)('cancel')}}>推送「跑操取消」通知</Button>
          </div>
          </Layout.Col>
        </Layout.Row>
        {this.state.loading ? <Loading fullscreen={true} text={this.state.loadingText}></Loading>:null}
      </div>
    )
  }
}

class App extends Component {
  

  render() {

    

    return (
      <BrowserRouter>
        <div>
          <Route path="/:sessionKey" component={Content} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
