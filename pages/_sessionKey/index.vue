<template>
  <section class="container">
    <div>
      <h1 class="title">跑操提醒推送</h1>
      <el-card class="box-card subtitle" v-loading="loading">
        <div>跑操通知状态</div>
        <div
          class="state"
          :class='{set:state==="正常跑操", cancel:state==="跑操取消", pending:state==="未设定"}'
        >{{state}}</div>
      </el-card>
      <div class="button-panel">
        <div>
          <el-button type="success" :disabled='state=="正常跑操"' round :loading="loading" @click='handleClick("set")'>推送「正常跑操」通知</el-button>
        </div>
        <div>
          <el-button type="danger" :disabled='state=="跑操取消"' round :loading="loading" @click='handleClick("cancel")'>推送「跑操取消」通知</el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from "~/components/Logo.vue";
import axios from "axios";

export default {
  head () {
    return {
      title: '小猴偷米跑操提醒'
    }
  },
  components: {
    Logo
  },

  async asyncData({ params }) {
    // 服务器执行
    let res = await axios.get(
      "https://myseu.cn/ws3/api/pe/morningExerciseNotification"
    );
    params.state = res.data.result.state;
    if (params.state === "set") {
      params.state = "正常跑操";
    } else if (params.state === "cancel") {
      params.state = "跑操取消";
    } else {
      params.state = "未设定";
    }
    params.date = res.data.result.date;
    return params;
  },

  methods: {
    async handleClick(state){

      this.$confirm('切换跑操提醒状态会触发全员推送，请确认信息准确', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
          customClass: "message-box"
        }).then(async () => {
          console.log(state)
          this.loading = true
          let res = await axios.post('https://myseu.cn/ws3/api/pe/morningExerciseNotification',{sessionKey:this.sessionKey, state})
          this.$message({
            message: res.data.success ? res.data.result: res.data.reason,
            type: res.data.success ? 'success':'error',
            customClass: "message-box",
          });
          this.loading = false
        }).catch(() => {
        });
    }
  },

  created() {
    setInterval(async () => {
      let res = await axios.get(
        "https://myseu.cn/ws3/api/pe/morningExerciseNotification"
      );
      let state = res.data.result.state;
      if (state === "set") {
        state = "正常跑操";
      } else if (state === "cancel") {
        state = "跑操取消";
      } else {
        state = "未设定";
      }
      this.state = state

    }, 1000);
  },
  data() {
    return {
      name: "赵拯基",
      loading: false
    };
  }
};
</script>

<style>
.container {
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 30px;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 40px;
  font-weight: bold;
  color: #35495e;
  letter-spacing: 1px;
  margin: 20px 20px;
}

.subtitle {
  margin-top: 30px;
  font-weight: 300;
  font-size: 20px;
  color: #526488;
  word-spacing: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  margin: 0 20px;
}

.state {
  border-radius: 5px;
  font-weight: bold;
  font-size: 20px;
  line-height: 42px;
  padding: 0 10px;
  margin: 20px;
}

.set {
  background: #67c23a;
  color: white;
}

.pending {
  background: #F2994A;
  color: white;
}

.cancel {
  background: #f78989;
  color: white;
}

.button-panel {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: 40px;
}

.button-panel div {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.message-box{
  width: 80vw;
  min-width: 80vw;
}
</style>
