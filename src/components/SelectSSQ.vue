<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col class="text-h4">
          投注
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select
            v-model="qihaoSelect"
            :items="qihaoOption"
            menu-props="auto"
            label="双色球期号"
          ></v-select>
        </v-col>
      </v-row>
      <v-row
        no-gutters
        justify="start"
      >
        <v-col cols="12">
          <div class="text-h5">红球(选择6个或者以上)</div>
        </v-col>
        <v-col
          v-for="(item, i) in redBall"
          v-bind:key="i"
          cols="auto"
        >
          <v-checkbox
            v-model="selectRedBall"
            :label="item"
            :value="item"
            class="mr-5"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row
        no-gutters
        justify="start"
      >
        <v-col cols="12">
          <div class="text-h5">蓝球(选择1个或者以上)</div>
        </v-col>
        <v-col
          v-for="(item, i) in blueBall"
          v-bind:key="i"
          cols="auto"
        >
          <v-checkbox
            v-model="selectBlueBall"
            :label="item"
            :value="item"
            class="mr-5"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="auto">您选择了<b class="orange text-h5">{{ selectRedBall.length }}</b>个红球，<b class="orange text-h5">{{ selectBlueBall.length }}</b>个蓝球，共 <b class="orange text-h5">{{ currentCount }}</b> 注，共 <b class="orange text-h5">{{ currentCount *2 }}</b> 元</v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row justify="end">
        <v-col
          class="d-flex flex-row text-h6"
          cols="auto"
        >
          投
          <v-btn
            icon
            @click="ssqMulit=ssqMulit>1?ssqMulit-1:ssqMulit"
          >
            <v-icon color="red">mdi-minus</v-icon>
          </v-btn>
          <div>{{ssqMulit}}</div>
          <v-btn
            icon
            @click="ssqMulit=ssqMulit+1"
          >
            <v-icon color="green">mdi-plus</v-icon>
          </v-btn>
          倍
        </v-col>
        <v-col cols="auto">
          <v-btn @click="calSSQ">选好了</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>

          <v-data-table
            :headers="headers"
            :items="desserts"
            hide-default-footer
            hide-default-header
            mobile-breakpoint=300
          >
            <template v-slot:top>
              <v-toolbar
                flat
                color="white"
              >
                <v-toolbar-title>清单</v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                ></v-divider>
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                small
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:[`item.redball`]="{ item }">
              <div
                class="red--text"
                dark
              >{{ item.redball }}</div>
            </template>
            <template v-slot:[`item.blueball`]="{ item }">
              <v-chip
                class="blue"
                dark
              >{{ item.blueball }}</v-chip>
            </template>
          </v-data-table>

        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <v-btn
            @click="uoloadEvent"
            class="mr-5"
          >取消</v-btn>
          <v-btn @click="qihaoDialog=true">确认</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-dialog v-model="qihaoDialog">
          <v-card>
            <v-card-title>
              期号确认
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="qihaoSelect"
                :items="qihaoOption"
                menu-props="auto"
                label="双色球期号"
              ></v-select>
            </v-card-text>
            <v-card-actions>

              <v-btn
                @click="qihaoDialog=false"
                class="mr-5"
              >取消</v-btn>
              <v-btn @click="putData">提交</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { Combine } from '@/utils/calcuate'
import { putUserDoubleBoll } from '@/api/getData'
import moment from 'moment'

export default {
  data: () => ({
    qihaoDialog: false,
    selectRedBall: [],
    selectBlueBall: [],
    ssqMulit: 1,
    headers: [
      { text: 'type', value: 'type' },
      { text: 'redball', value: 'redball' },
      { text: 'blueball', value: 'blueball' },
      { text: 'multiple', value: 'multiple' },
      { text: 'count', value: 'count' },
      { text: 'sale', value: 'sale' },
      { text: 'actions', value: 'actions' }
    ],
    desserts: [],
    qihaoSelect: ''
  }),
  computed: {
    redBall() {
      const ret = []
      for (let i = 1; i <= 33; i++) {
        let ball = String(i)
        if (ball.length === 1) {
          ball = '0' + ball
        }
        ret.push(ball)
      }
      return ret
    },
    blueBall() {
      const ret = []
      for (let i = 1; i <= 16; i++) {
        let ball = String(i)
        if (ball.length === 1) {
          ball = '0' + ball
        }
        ret.push(ball)
      }
      return ret
    },
    currentCount() {
      return Combine(this.selectRedBall.length, 6) * this.selectBlueBall.length * this.ssqMulit
    },

    qihaoOption() {
      return this.$store.state.ssqQiHao
    }
  },
  //   watch: {
  //     qihao: {
  //       handler: function () {
  //         this.qihaoUpdate()
  //       },
  //       immediate: true
  //     }
  //   },
  mounted() {
    // this.qihaoUpdate()

    if (moment().hour() > 20 && [0, 2, 4].includes(moment().weekday())) {
      this.qihaoSelect = this.qihaoOption[0].value
    } else {
      this.qihaoSelect = this.qihaoOption[1].value
    }
  },
  methods: {
    uoloadEvent() {
      this.$emit('complete')
    },
    async putData() {
      const opt = []
      if (this.desserts.length < 1) {
        return
      }
      for (const obj of this.desserts) {
        opt.push({
          qihao: this.qihaoSelect,
          redball: obj.redball.replace(/,/g, ' '),
          blueball: obj.blueball.replace(/,/g, ' '),
          multiple: Number(obj.multiple.replace('倍', ''))
        })
      }
      await putUserDoubleBoll(opt)
      this.desserts = []
      this.$emit('complete')
    },
    calSSQ() {
      if (this.selectBlueBall.length >= 1 && this.selectRedBall.length >= 6) {
        const count = Combine(this.selectRedBall.length, 6) * this.selectBlueBall.length
        this.desserts.push({
          type: count > 1 ? '复式' : '单式',
          redball: this.selectRedBall.sort().join(','),
          blueball: this.selectBlueBall.sort().join(','),
          multiple: this.ssqMulit + '倍',
          count: this.currentCount + '注',
          sale: this.currentCount * 2 + '元'
        })
        this.selectBlueBall = []
        this.selectRedBall = []
      }
    },

    deleteItem(item) {
      const index = this.desserts.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
    }

  }
}
</script>
