<template>
  <v-card>
    <v-container>
      <v-row>
        <h1>Double Ball</h1>
      </v-row>
      <v-row>
        <v-btn
          color="red lighten-2"
          dark
          @click="dialog=true;qihaoUpdate()"
        >
          New Item
        </v-btn>
      </v-row>
      <v-row>
        <v-col>

          <v-data-table
            :headers="unOpenheaders"
            :items="dessertsUnOpen"
            hide-default-footer
            mobile-breakpoint=300
          >
            <template v-slot:top>
              <v-toolbar
                flat
                color="white"
              >
                <v-toolbar-title>未开奖</v-toolbar-title>
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
                @click="deleteUnOpenItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:[`item.redball`]="{ item }">
              <div
                class="red--text p-0"
                dark
              >{{ item.redball }}</div>
            </template>
            <template v-slot:[`item.blueball`]="{ item }">
              <!-- <v-chip
                class="blue m-0"
                dark
              >{{ item.blueball }}</v-chip> -->

              <div
                class="blue--text p-0"
                dark
              >{{ item.blueball }}</div>
            </template>
          </v-data-table>

        </v-col>
      </v-row>
      <v-row>
        <v-col>

          <v-data-table
            :headers="headers"
            :items="dessertsOpen"
            mobile-breakpoint=300
          >
            <template v-slot:top>
              <v-toolbar
                flat
                color="white"
              >
                <v-toolbar-title>已开奖</v-toolbar-title>
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
                class="red--text p-0"
                dark
              >{{ item.redball }}</div>
            </template>
            <template v-slot:[`item.blueball`]="{ item }">
              <div
                class="blue--text p-0"
                dark
              >{{ item.blueball }}</div>
              <!-- <v-chip
                class="blue"
                dark
              >{{ item.blueball }}</v-chip> -->
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row>
        <v-dialog
          v-model="dialog"
          fullscreen
        >
          <SelectSSQ v-on:complete="completeNew" />
        </v-dialog>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>

import SelectSSQ from '../components/SelectSSQ'
import { Combine, randerAward } from '@/utils/calcuate'
import { getUserDoubleBoll, getQihao, deleteUserDoubleBoll } from '@/api/getData'
import moment from 'moment'

export default {

  components: {
    SelectSSQ
  },

  data: () => ({
    dialog: false,
    unOpenheaders: [
      { text: '期号', value: 'qihao' },
      { text: '红球', value: 'redball' },
      { text: '蓝球', value: 'blueball' },
      { text: '倍数', value: 'multiple' },
      // { text: '注', value: 'count' },
      // { text: '金', value: 'sale' },
      { text: '操', value: 'actions' }
    ],
    headers: [
      { text: '期号', value: 'qihao' },
      { text: '红球', value: 'redball' },
      { text: '蓝球', value: 'blueball' },
      { text: '倍数', value: 'multiple' },
      // { text: '注', value: 'count' },
      // { text: '本', value: 'sale' },
      { text: '当', value: 'current' },
      { text: '历', value: 'history' },
      { text: '操', value: 'actions' }
    ],
    dessertsOpen: [],
    dessertsUnOpen: []
  }),
  mounted() {
    this.updateTable()
  },
  methods: {
    // 更新期号
    async qihaoUpdate() {
      console.log("update qi hao")
      const data = await getQihao()
      const qihaoOption = data.map(each => {
        return {
          value: each.q,
          text: '20' + each.q
        }
      })
      console.log(qihaoOption[0])
      //   添加后1期
      qihaoOption.unshift({
        value: String(Number(qihaoOption[0].value) + 1),
        text: String(Number(qihaoOption[0].text) + 1)
      })

      //   添加后2期
      //   if ([0, 2, 4].includes(moment().weekday())) {
      qihaoOption.unshift({
        value: String(Number(qihaoOption[0].value) + 1),
        text: String(Number(qihaoOption[0].text) + 1)
      })
      //   }

      //   判断是否加入新一年的期号
      if (moment().dayOfYear() > 363) {
        qihaoOption.unshift({
          value: String(moment().year() % 100) + '001',
          text: String(moment().year()) + '001'
        })
      }
      this.$store.commit('setssqQiHao', qihaoOption)
    },

    async completeNew() {
      this.dialog = !this.dialog
      await this.updateTable()
    },
    async deleteItem(item) {
      const opt = { ID: item.ID }
      if (confirm('Are you sure you want to delete this item?')) {
        await deleteUserDoubleBoll(opt)
        await this.updateTable()
      }
    },

    async updateTable() {
      this.qihaoUpdate()
      this.dessertsOpen = []
      const data = await getUserDoubleBoll()
      for (const obj of data.open) {
        const count = Combine(obj.redball.split(' ').length, 6) * obj.blueball.split(' ').length * obj.multiple
        const history = []
        if (obj.history != null) {
          for (const hobj of obj.history) {
            history.push('期号：20' + hobj.Q + ',' + randerAward(hobj))
          }
        }
        this.dessertsOpen.push({
          ID: obj.ID,
          qihao: obj.qihao,
          redball: obj.redball,
          blueball: obj.blueball,
          multiple: obj.multiple,
          count: count,
          sale: count * 2,
          current: randerAward(obj),
          history: history.join('。')

        })
      }

      this.dessertsUnOpen = []
      for (const obj of data.unopen) {
        const count = Combine(obj.redball.split(' ').length, 6) * obj.blueball.split(' ').length * obj.multiple
        const history = []
        if (obj.history != null) {
          for (const hobj of obj.history) {
            history.push('期号：20' + hobj.Q + ',' + randerAward(hobj))
          }
        }
        this.dessertsUnOpen.push({
          qihao: obj.qihao,
          redball: obj.redball,
          blueball: obj.blueball,
          multiple: obj.multiple,
          count: count,
          sale: count * 2,
          current: randerAward(obj),
          history: history.join('。')

        })
      }
    }

  }
}
</script>
