<template>
    <div>
        <el-input placeholder="输入name和uuid进行搜索" v-model="filterText">
        </el-input>
        <div class="grid-content treeList">
            <el-tree :data="treeData" ref="tree" 
                    :props="treeProps" 
                    highlight-current 
                    :node-key="nodeKey"
                    :expand-on-click-node="false" 
                    :render-content="renderTreeContent" 
                    :filter-node-method="filterNode"
                    @node-click="handleNodeClick"
                    @node-contextmenu="handleNodeRightClick">
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
            // 选中DOM节点
            this._evalCode("window.changeDOMBorder("
                + "'" + data.uuid + "')");
            console.log(data.uuid);
            this._freshNode(data.uuid);
        },
        // 右键点击节点触发的函数
        handleNodeRightClick(event, data, node, com) {
            console.log(event, data, node, com);
            console.log(com.$el.classList);
            com.$el.classList.push("el-tree--rightclick");
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
            let clickFunc = function(event) {
                let newelement = event.srcElement;
                if (this.oldelement) {
                    this.oldelement.className = "custom-tree-node";
                }
                this.oldelement = newelement;
                newelement.className = "custom-tree-node checked-tree-node";
            }.bind(this);
            return (
                <span class="custom-tree-node" on-click={clickFunc}>
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

.is-current {
    background-color: blue !important; 
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
