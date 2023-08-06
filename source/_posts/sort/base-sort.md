---
title: Radix Sort
date: 2023-08-01 22:00:31
categories:
  - Algorithm
  - Sort
tags:
  - Algorithm
  - Sort
  - Radix Sort
---

排序和查找是常见的编程基本算法，刚毕业时还曾花时间[学习](https://github.com/JinZhang-96/algorithm/tree/master/algorithm/src/com/zb/arraySort)，由于平时不怎么使用，所以现在对每种排序算法的计算过程已经渐渐淡忘。。。

今天回忆了一下基数排序的算法的思路，动手敲了一遍代码，算是熟练了一些，有些心得：

> 学习算法不能仅仅参照一个例题或者一段实现代码，死记硬背的学习，而是需要理解其算法思想，融会贯通，这样才能举一反三，精益求精。就像学习数学一样，如果不理解其公式，就很难做到灵活使用，在题目中提炼数学抽象模型，套用数学公式解决问题。

排序算法有很多，如：冒泡排序、选择排序、插入排序、快速排序、堆排序、归并排序、基数排序，其中基数排序是一个较稳定并且高效的算法，非常适合对元素位数相近的数组排序。

<!-- more -->

### 时间复杂度

基数排序的时间复杂度受待排数据最大数位数 k 的影响，如最大数位数为 10，则 k 为 10。  
其时间复杂度公式为 `O(n * k)`。

### 算法思想

基数排序的核心思想是利用数据局部顺序性的传递，一步步进行推导，来确定数据最终的顺序性。

1. 从数据的第一位开始比较， 把数字相同的归类到一起。
2. 归类完成后，再把归类的数据从小到大聚集到一起。
3. 循环 第 1 和第 2 步，直到所有的位数都比较一遍。

### 代码实现

```javascript
/*
 * @Description: TODO
 * @Author: zb
 * @Date: 2023-08-01 21:17:58
 * @LastEditors: zb
 * @LastEditTime: 2023-08-07 01:38:43
 */
let num = 1000,
  max = 10000;

let data = [];

for (let i = 0; i < num; i++) {
  data.push(Number.parseInt(Math.random() * max));
}

const mapData = new Map();

/**
 * 
 * @param {*} data 待排序数组
 * @param {*} position 第几位
 * @returns 
 */
const baseSort = function (data, position) {

  for (let i = 0; i < data.length; i++) {
    const l = data[i].toString().length;
    // 取出当前排序位数的数字， 如果没有数字，则设置为最小值0
    let n =
      l - 1 < position
        ? 0
        : Number.parseInt(data[i].toString().charAt(l - 1 - position));
        
    if (!mapData.has(n)) {
      mapData.set(n, []);
    }
    mapData.get(n).push(data[i]);
  }

  // 合并排序完的数组
  return [...mapData.keys()]
    .sort((a, b) => a - b)
    .map((key) => mapData.get(key))
    .reduce((arr, itemArr) => (arr.push(...itemArr), arr), []);
};

let maxLength = 0;

// 找到待排序数组中位数最长的数组
for (let i = 0; i < data.length; i++) {
  maxLength = Math.max(maxLength, data[i].toString().length);
}

// 对待排序数组中的每一位数字进行排序
for (let i = 0; i < maxLength; i++) {
  data = baseSort(data, i);
  mapData.clear();
}

console.log(data);
```
