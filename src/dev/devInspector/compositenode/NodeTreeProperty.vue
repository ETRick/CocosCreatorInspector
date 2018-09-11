<template>
  <div>
    <el-input placeholder="输入name和uuid进行搜索" v-model="filterText" />
    <el-tree :data="treeData" ref="tree" 
            class="grid-content treeList"
            :props="treeProps" 
            highlight-current 
            :node-key="nodeKey"
            :expand-on-click-node="false" 
            :render-content="renderTreeContent" 
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            draggable
            @node-drop="dropNode">
    </el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterText: ""
    };
  },
  watch: {
    // 用于节点框过滤
    filterText(value) {
      this.$refs.tree.filter(value);
    }
  },
  methods: {
    // 点击节点的触发函数
    handleNodeClick(data, node) {
      console.log("Click uuid:" + data.uuid);
      this.clickQuadNode(data.uuid);
    },
    // 拖拽节点触发的函数
    dropNode(fromNode, toNode, type) {
      this.changeNodeTree(fromNode.data.uuid, toNode.data.uuid, type);
    },
    // 过滤节点函数
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
            for (let compname of data.components) {
              if (compname.hasSubstrIgnoreCase(str.substr(2))) {
                console.log(compname);
                return true;
              }
            }
            break;
          }
          // 通过name判断
          default: {
            if (data.name.hasSubstrIgnoreCase(str)) {
              return true;
            }
          }
        }
      }

      return false;
    },
    // 渲染树节点函数
    renderTreeContent(h, { node, data, store }) {
      return (
        <span style={addStyle()}>
          <span>{data.name}</span>
        </span>
      );

      // 根据属性添加删除线
      function addStyle() {
        if (data.activeInHierarchy === false) {
          return {
            "text-decoration": "line-through",
            color: "#8c8e92"
          };
        }
      }
    }
  },
  props: [
    "treeData",
    "nodeKey",
    "treeProps"
  ]
};
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
    text-decoration: line-through;
  }

  .-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
