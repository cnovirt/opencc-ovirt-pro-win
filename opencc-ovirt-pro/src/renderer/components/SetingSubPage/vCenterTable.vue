<template>
  <el-table height="320" :data="tableData" style="width: 100%">
    <el-table-column prop="num" label="序号" width="180"> </el-table-column>
    <el-table-column prop="ipaddr" label="IP地址" width="180">
    </el-table-column>
    <el-table-column prop="scopevalue" label="域值"> </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'seting-center-table-page',
  data() {
    return {
      tableData: [
        {
          num: '01',
          ipaddr: '192.168.8.111',
          scopevalue: 'aaaa',
        },
      ],
    }
  },
  methods: {},
}
</script>

<style scoped>
.el-table {
  text-align: center;
}
</style>
