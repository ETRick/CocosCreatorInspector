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
            // 选中Graphics中的节点
            this._evalCode("window.clickQuadNode("
                + "'" + data.uuid + "')");
            this._freshNode(data.uuid);
        },
        filterNode(filtervalue, data) {
            if (!filtervalue) {
                return true;
            }

            // 将多项过滤分离
            let strs = filtervalue.split(" ");

            // 每个过滤信息分别判断
            for (let str of strs) {
                switch (str.substr(0, 2)) {
                    // 通过uuid判断
                    case "u:": {
                        if (data.uuid.hasSubstrIgnoreCase(str.substr(2))) {
                            return true;
                        }
                        break;
                    } 
                    // 通过type判断
                    case "t:": {
                        for (let name of data.components) {
                            if (name.hasSubstrIgnoreCase(str.substr(2))) {
                                return true;
                            }
                        }
                        break;
                    }
                    // 通过name判断
                    default: {
                        if (data.label.hasSubstrIgnoreCase(str)) {
                            return true;
                        }
                    }
                }
            }

            return false;
        },
        // 渲染树节点
        renderTreeContent(h, { node, data, store }) {
            return (
                <span style={true ? "delete-line" : ""}>
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

.delete-line {
    text-decoration:line-through;
}

</style>
