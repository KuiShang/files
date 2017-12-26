export default {
      optionData: [
        {
          title: { value: "flowTypeId", label: "审批组" },
          data: JSON.parse(sessionStorage.getItem("approveGroup"))
        },
        {
          title: { value: "urgencyLevel", label: "紧急程度" },
          data: [
            { value: "", label: "全部紧急程度" },
            { value: "0", label: "很紧急" },
            { value: "1", label: "一般紧急" },
            { value: "2", label: "不紧急" }
          ]
        }
      ]

}