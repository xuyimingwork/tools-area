<script setup lang="ts">
  import { ref } from 'vue';
  import pick from './pick';
  import { AREA_LEVEL_LIST } from './static';

  const initFilter = localStorage.getItem('filter') && JSON.parse(localStorage.getItem('filter'))

  const filter = ref(Object.assign({}, {
    checked: [...AREA_LEVEL_LIST],
    totalArea: 100,
    totalAreaAdd: 0,
    totalAreaMinus: 10,
    minCount: 1,
    maxCount: 3,
    contains: []
  }, initFilter || undefined))
  
  const progress = ref('')
  const result = ref('')
  const calculateLoading = ref(false)
  const calculate = async () => {
    localStorage.setItem('filter', JSON.stringify(filter.value))
    calculateLoading.value = true
    progress.value = ''
    result.value = ''
    const minArea = (+filter.value.totalArea) - (+filter.value.totalAreaMinus)
    const maxArea = (+filter.value.totalArea) + (+filter.value.totalAreaAdd)
    const getItemsTotal = items => items.reduce((total, o) => total + o, 0)
    const getItemsInfo = items => `${items.length}套 面积${getItemsTotal(items)} 误差${filter.value.totalArea - getItemsTotal(items)} 详细：${items.join(',')}`
    const checkArea = (items) => {
      const total = getItemsTotal(items)
      if (!filter.value.totalArea) return true
      return total >= minArea && total <= maxArea
    }
    const getArrayItemAppear = (array: any[]): Map<any, number> => {
      return array.reduce((map, item) => {
        if (!map.has(item)) map.set(item, 0)
        map.set(item, map.get(item) + 1)
        return map
      }, new Map())
    }
    const contain = (items) => {
      const contains = filter.value.contains
      if (!contains.length) return true
      const itemsAppear = getArrayItemAppear(items)
      const containsAppear = getArrayItemAppear(contains)
      return [...containsAppear.keys()].every(key => containsAppear.get(key) <= (itemsAppear.get(key) || 0))
    }
    const map = await pick(filter.value.checked, +filter.value.minCount, +filter.value.maxCount, (items) => {
      if (!checkArea(items)) return false
      progress.value = getItemsInfo(items)
      if (!contain(items)) return false
      progress.value = getItemsInfo(items)
      return true
    })

    const results = [...map.values()]
    progress.value = ''
    result.value = `总方案数：${results.length}\n` + results.sort((a, b) => getItemsTotal(b) - getItemsTotal(a)).map(items => getItemsInfo(items)).join('\n')
    calculateLoading.value = false
  } 

  const showAddContains = ref(false)
  const pickedForAddToContains = ref()
</script>
<template>
  <van-form :disabled="calculateLoading">
    <van-field label="欲选面积">
      <template #input>
        <van-checkbox-group :disabled="calculateLoading" v-model="filter.checked" direction="horizontal">
          <van-checkbox v-for="areaLevel of AREA_LEVEL_LIST" :name="areaLevel">{{ areaLevel }}</van-checkbox>
        </van-checkbox-group>
      </template>
    </van-field>
    <van-field label="必须包括">
      <template #input>
        <van-tag v-for="(area, i) of filter.contains" size="large" style="margin-right: 8px;" type="primary" :closeable="!calculateLoading" @close="() => { filter.contains.splice(i, 1) }">{{ area }}</van-tag>
      </template>
      <template #button>
        <van-button :disabled="calculateLoading" icon="plus" type="primary" @click="() => showAddContains = true" />
        <van-popup v-model:show="showAddContains" round position="bottom">
          <div style="padding: 20px;">
          <van-radio-group v-model="pickedForAddToContains" direction="horizontal">
            <van-radio  v-for="areaLevel of AREA_LEVEL_LIST" :name="areaLevel">{{ areaLevel }}</van-radio>
          </van-radio-group>
          <div style="margin: 0 auto;">
          <van-button style="margin-top: 12px;" icon="plus" type="primary" @click="() => {
            filter.contains.push(pickedForAddToContains)
            showAddContains = false
          }">添加</van-button>
          </div>
          </div>
        </van-popup>
      </template>
    </van-field>
    <van-field
      v-model="filter.totalArea"
      type="digit"
      label="总面积"
    />
    <van-field
      v-model="filter.totalAreaAdd"
      type="digit"
      label="允许超过"
    />
    <van-field
      v-model="filter.totalAreaMinus"
      type="digit"
      label="允许不足"
    />
    <van-field
      v-model="filter.minCount"
      type="digit"
      label="最少套数"
    />
    <van-field
      v-model="filter.maxCount"
      type="digit"
      label="最多套数"
    />
    <div style="margin: 16px;">
      <van-button round block :loading="calculateLoading" type="primary" @click="calculate">
        计算方案
      </van-button>
    </div>
  </van-form>
  <div v-if="progress" style="white-space: pre-line; padding: 16px;">{{ progress }}</div>
  <div style="white-space: pre-line; padding: 16px;">{{ result }}</div>
</template>
