<template>
<v-card>
    <v-container>
        <v-row>
            <h1>Double Ball</h1>
        </v-row>
        <v-row>

            <v-dialog
      v-model="dialog"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="red lighten-2"
          dark
          v-bind="attrs"
          v-on="on"
        >
          New Item
        </v-btn>
      </template>

      <SelectSSQ v-on:complete="completeNew" />
    </v-dialog>
        </v-row>
          <v-row>
        <v-col>

<v-data-table
    :headers="headers"
    :items="dessertsUnOpen"
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
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
      <div class="red--text" dark>{{ item.redball }}</div>
    </template>
    <template v-slot:[`item.blueball`]="{ item }">
      <v-chip class="blue" dark>{{ item.blueball }}</v-chip>
    </template>
  </v-data-table>

        </v-col>
    </v-row>
     <v-row>
        <v-col>

<v-data-table
    :headers="headers"
    :items="dessertsOpen"
    hide-default-footer
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
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
      <div class="red--text" dark>{{ item.redball }}</div>
    </template>
    <template v-slot:[`item.blueball`]="{ item }">
      <v-chip class="blue" dark>{{ item.blueball }}</v-chip>
    </template>
  </v-data-table>

        </v-col>
    </v-row>
    </v-container>
</v-card>
</template>

<script>

import SelectSSQ from '../components/SelectSSQ'
import { Combine, randerAward } from '@/utils/calcuate'
import { getUserDoubleBoll, deleteUserDoubleBoll } from '@/api/getData'

export default {

  components: {
    SelectSSQ
  },

  data: () => ({
    dialog: false,
    headers: [
      { text: '期号', value: 'qihao' },
      { text: '红球', value: 'redball' },
      { text: '篮球', value: 'blueball' },
      { text: '倍数', value: 'multiple' },
      { text: '注数', value: 'count' },
      { text: '本金', value: 'sale' },
      { text: '当期', value: 'current' },
      { text: '历史', value: 'history' },
      { text: '操作', value: 'actions' }
    ],
    dessertsOpen: [],
    dessertsUnOpen: []
  }),
  mounted () {
    this.updateTable()
  },
  methods: {
    async completeNew () {
      this.dialog = !this.dialog
      await this.updateTable()
    },
    async deleteItem (item) {
      const opt = { ID: item.ID }
      if (confirm('Are you sure you want to delete this item?')) {
        await deleteUserDoubleBoll(opt)
        await this.updateTable()
      }
    },

    async updateTable () {
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
