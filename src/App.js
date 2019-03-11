import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Layout } from 'element-react'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { serverState:'pending' , date:'20XX-XX-XX',  };
    this.refresh = setInterval(async ()=>{
     let res = await axios.get('https://myseu.cn/ws3/api/pe/morningExerciseNotification')
     let serverStatus = res.data.result
     this.setState({serverState:serverStatus.state, date:serverStatus.data})
    }, 3000);
  }

  componentWillUnmount(){
    clearInterval(this.refresh)
  }

  render() {

    const stateNameMap = {
      'set':'跑操正常进行',
      'cancel':'跑操取消',
      'pending':'未设置'
    }

    return (
      <div>
        <Layout.Row>
          <Layout.Col>
            小猴偷米跑操提醒推送后台
          </Layout.Col>
        </Layout.Row>
      </div>
    );
  }
}

export default App;
