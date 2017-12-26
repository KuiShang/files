<template lang="html">
    <div class="forward-search" :class="{'high-light': isSearch}">
        <div class="onblur" v-show="!isSearch" @click="searchClick"><i class="search_logo"></i></div>
        <div class="focus" v-show="isSearch">
            <i class="search_logo"></i>
            <input
                ref="input"
                class="forward-input"
                type="text"
                placeholder="搜索"
                autofocus
                v-model="query"
                @focus="handleFocus"
                @blur="handleBlur"
                @contextmenu="showSystemcontextmenu">
        </div>
    </div>

</template>
<script type="text/ecmascript-6">
    export default{
        name: 'ksearchInput',
        data() {
            return {
                isSearch: true,
                searchString: ''
            };
        },
        methods: {
            showSystemcontextmenu(e) {
                e.stopPropagation();
            },
            handleFocus() {

            },
            handleBlur() {
                if (this.searchString) {
                    return;
                }
                this.isSearch = false;
            },
            searchClick() {
                this.isSearch = true;
                this.$nextTick(() => {
                    this.$refs.input.focus();
                });
            }
        },
        computed: {
            query: {
                get() {
                    return this.value;
                },
                set(val) {
                    let trimStr = val.trim();
                    if (trimStr === this.searchString) {
                        return;
                    }
                    this.searchString = trimStr;
                    this.$emit('input', trimStr);
                    console.log('search:', trimStr);
                }
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

    .forward-search {
        height: 30px;
        line-height: 30px;
        border: 2px solid #fff;
        background-color: #f3f4f5;
        border-radius: 30px;
        padding-left: 10px;
        margin-bottom: 15px;
        margin-top: 20px;
        .onblur {
            text-align: center;

        }
        .search_logo {
            display: inline-block;
            width: 20px;
            height: 20px;
            vertical-align: middle;
            background: url(./glass.png);
            background-size: 100% 100%;
        }
        .forward-input {
            background-color: #f3f4f5;
            display: inline-block;
            vertical-align: middle;
            width: 210px;
            border: none;
            outline: none;
        }
    }

    .high-light {
        border: 2px solid rgba(62,137,247,0.50);
    }
</style>
