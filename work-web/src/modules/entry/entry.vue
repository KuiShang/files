<template>
    <div class="entry-container">
        <div class="main-container">
            <!-- 头部通栏 -->
            <div class="login-header">
                <div class="brand"></div>
            </div>
            <router-view></router-view>

             <!-- 底部通栏 -->
            <div class="footer">
                ©2017&nbsp;&nbsp;美信网络技术有限公司版权所有
            </div>
        </div>
    </div>
</template>
<script>
    export default{
       
    }
</script>
<style lang="scss" scoped>
$img-path: '../../assets/imgs';
.entry-container{
    width: 100%;
    height: 100%;
    overflow-y:auto;
}
.main-container{
    width: 100%;
    height: 100%;
    min-width: 1007px;
    min-height: 900px;
    overflow-y:auto;
    position: relative;
}
.login-header{
    height:80px;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
    padding-left: 50px;
    .brand {
        width: 200px;
        height: 100%;
        background: url("#{$img-path}/logo.png") no-repeat center;
        background-size: 100% 67px;
    }
}

.footer {
    position: absolute;
    left: 50%;
    bottom: 0px;
    margin-left: -600px;
    width: 1200px;
    height: 64px;
    line-height: 64px;
    border-top: 1px solid #E7E7E7;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 12px;
    color: #999;
}
</style>