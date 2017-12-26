// var Meiban = {};
//
// $(function() {
//     new QWebChannel(qt.webChannelTransport, function(channel) {
//         Meiban.mainObject = channel.objects.qMainObject;
//         Meiban.publicObject = channel.objects.qWebPublicObj;
//         Meiban.qFileTransferObj = channel.objects.qFileTransferObj;
//         Meiban.menuObject = channel.objects.qMenuObject;
//
//         var callbackMap = new Map();
//
//         Meiban.getSession = function(callback) {
//             if (callback) {
//                 callbackMap.set('getSession', callback);
//             }
//             Meiban.mainObject.getSession();
//         }
//
//         Meiban.mainObject.siggetSession.connect(function(data) {
//             console.log(data);
//             callbackMap.get('getSession')(data);
//         })
//     })
//
//     Meiban.install = function(Vue) {
//         Vue.prototype.$Meiban = Meiban;
//     }
// });
//
//
// var callbackMap = new Map();
//
//
// Meiban.install = function(Vue) {
//     Vue.prototype.$Meiban = Meiban;
// }
//
// Meiban.getSession = function(callback) {
//     if (callback) {
//         callbackMap.put('getSession', callback);
//     }
//     Meiban.mainObject.getSession();
// }
//
// Meiban.mainObject.siggetSession.connect(function(data) {
//     callbackMap.get('getSession')(data);
// })
