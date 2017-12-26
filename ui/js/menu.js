var menuData;
$(function() {
    new QWebChannel(qt.webChannelTransport, function(channel) {
        window.menuObject = channel.objects.qMenuObject;

        menuObject.getMenuInfo(function(data) {
            console.log(data);
            menuData = data;
            if (data.bTopSession == true) {
                $('#cancel-top').removeAttr('style');
                $('#delete').removeAttr('style');
            } else {
                $('#top').removeAttr('style');
                $('#delete').removeAttr('style');
            }
            menuObject.onHtmlReady();
        });

        $('#top').on('click', function() {
            menuObject.setSesssionTop({
                'groupId': menuData.groupId,
                'bTopSession': true
            });
            menuObject.CloseWnd();
        });

        $('#cancel-top').on('click', function() {
            menuObject.setSesssionTop({
                'groupId': menuData.groupId,
                'bTopSession': false
            });
            menuObject.CloseWnd();
        });

        $('#delete').on('click', function() {
            menuObject.delSessionItem({
                'groupId': menuData.groupId
            });
            menuObject.CloseWnd();
        });


        $(window).blur(function() {
			// 关闭弹窗
            menuObject.CloseWnd();
        });
    });
});
