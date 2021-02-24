import { Message } from "ant-design-vue";
export function exportFile(data, fileName, dialogName) {
  let blob = new Blob([data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" //application/vnd.ms-excel
  });
  if (blob.size > 0) {
    let objectUrl = URL.createObjectURL(blob); //创建url对象
    let link = document.createElement("a");
    link.style.display = "none";
    link.href = objectUrl;
    link.download = fileName + ".xlsx"; //下载后文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href); //销毁url对象
  }
  Message.success({
    content: "导出成功!",
    key: dialogName || "exportStatistics",
    duration: 2
  });
}
export function scrollToField(ruleForm, fieldObj) {
  let fields = [];
  for (let key in fieldObj) {
    fields.push(key);
  }
  let first = fields.shift();
  let firstField = ruleForm.fields.filter(z => z.prop === first).shift();
  // let scrollY = firstField.$el.scrollHeight;
  // window.scrollTo(0, scrollY);
  firstField.$el.scrollIntoView()
}
