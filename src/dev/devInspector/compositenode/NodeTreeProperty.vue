<template>
    <div>
        <el-input placeholder="输入name和uuid进行搜索" v-model="filterText">
        </el-input>
        <div class="grid-content treeList">
            <el-tree :data="treeData" ref="tree" 
                    :props="treeProps" 
                    show-checkbox 
                    check-strictly 
                    highlight-current 
                    :node-key="nodeKey"
                    :expand-on-click-node="false" 
                    :render-content="renderTreeContent" 
                    :filter-node-method="filterNode" 
                    @node-click="handleNodeClick">
            </el-tree>
        </div>
    </div>
</template>

<script>
export default {
    name: "app",
    data() {
        return {
            filterText: "",
        };
    },
    watch: {
      filterText(value) {
        this.$refs.tree.filter(value);
      }
    },
    methods: {
        // 点击节点的触发函数
        handleNodeClick(data, node) {
            // 设置唯一选择框
            this.$refs.tree.setCheckedKeys([data.uuid]);
            this._freshNode(data.uuid);
        },
        filterNode(filtervalue, data) {
            if (!filtervalue) {
                return true;
            }
            return data.label.toLowerCase().indexOf(filtervalue.toLowerCase()) !== -1 
                || data.uuid.toLowerCase().indexOf(filtervalue.toLowerCase()) !== -1;
        },
        // 渲染树节点
        renderTreeContent(h, { node, data, store }) {
            return (
                <span class="custom-tree-node">
                <span>{data.label}</span>
                </span>
            );
        },
    },
    props: [
        "treeData",
        "nodeKey",
        "treeProps",
    ],
}
</script>

<style scoped>
.treeList {
  overflow-x: auto;
  height: 100%;
  width: 100%;
}

.grid-content {
  border-radius: 4px;
  min-height: 20px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
