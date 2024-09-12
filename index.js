// rule validate (những yêu cầu để công nhận là validate)
// email: isRequired, isEmail
// name: isRequired, isName(có thể tiếng việt, tiếng anh, max 50)
// gender: isRequired
// country: isRequired
// password: isRequired, min 8 , max 30
// confirmedPassword: isRequired, min 8 , max 30, isSame(password)
// agree: isRequired
const REG_EMAIL =
  /^[a-zA-Z\d\.\-\_]+(\+\d+)?@[a-zA-Z\d\.\-\_]{1,65}\.[a-zA-Z]{1,5}$/;
const REG_NAME =
  /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+((\s[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+)+)?$/;

//viết các hàm: nhận vào giá trị, kiểm tra và trả ra chuỗi chửi
//              nếu kiểm tra mà đúng thì "" (chuỗi rỗng)
const isRequired = (value) => (value ? "" : "That field is required");
    // if(value != "") return "";
    // else return "That field is required";
    //hàm nhận vào chuỗi rỗng
    // nếu k phải chuỗi rỗng thì trả ra chuỗi rỗng

const isEmail = (value) => (REG_EMAIL.test(value) ? "" : "Email is invalid");


const isName = (value) => (REG_NAME.test(value) ? "" : "Name is invalid");

const min = (numBound) => (value) => value.length >= numBound ? "" : `Min is ${numBound}`;

const max = (numBound) => (value) => value.length <= numBound ? "" : `Max is ${numBound}`;

const isSame = (paramsValue, fieldName1, fieldName2) => (value) => {
    return value == paramsValue ? "" : `${fieldName1} is not same ${fieldName2}`;
};

//Học cách mô tả trường dữ liệu như 1 font-end đẳng cấp thế giới Lê Điệp
/*
    Đối với một inputNode thì ta phải nhìn nó dưới dạng 1 object có các thành phần sau;
    {
        value: giá trị cần ktra của input
        funcs: mảng các hàm mà mình sẽ ktra value: hàm trong đó có dạng 
                //(value) => chửi
        parentNode: node cha của thằng input để đặt câu chửi
        controlNodes: mảng các input để tô đỏ (thêm class is-invalid)
         
    }
*/
// let nameNode = document.querySelector("#name");//nút inputName
// let parasObject = {
//     value: nameNode.value,
//     funcs: [isRequired, isName],
//     parentNode: nameNode.parentElement,
//     controlNodes: [nameNode]
// };

//viết hàm tạo thông báo chửi
const createMsg = (parentNode, controlNodes, msg) => {
    //tạo div chứa Msg cần chửi
    let invalidDiv = document.createElement("div");
    invalidDiv.innerHTML = msg;
    invalidDiv.className = "invalid-feedback";
    parentNode.appendChild(invalidDiv);
    //tô đỏ các input
    controlNodes.forEach((inputNode)=> {
        inputNode.classList.add("is-invalid");
    });
};
//test
// let nameNode = document.querySelector("#name");
// createMsg(nameNode.parentElement, [nameNode], "Name is invalid!");

//Hàm isValid: là hàm nhận vào object có dạng 
// {value, funcs, parentNode, controlNodes}
//duyệt funcs, đi qua từng func với value
//        nếu bị chửi gọi createMsg và retrun câu chửi
//nếu duyệt funcs không bị chửi
    //không bị dừng thì return "" 

const isValid = ({value, funcs, parentNode, controlNodes}) => {//làm cho code dễ đọc dễ hiểu hơn
    //duyệt danh sách các hàm cần kiểm tra
    // funcs.forEach((funcCheck) => {//trong js forEach không chịu kiểm soát return
    for(const funcCheck of funcs){
        let msg = funcCheck(value);
        if(msg){
            createMsg(parentNode, controlNodes, msg);
            return msg;
        };
    };
    return "";
};

//test 
// let nameNode = document.querySelector("#name");

// isValid({
//     value: nameNode.value,
//     funcs: [isRequired, isName],
//     parentNode: nameNode.parentElement,
//     controlNodes: [nameNode]
// });

//hàm xóa thông báo lỗi
const clearMsg = () => {
    document.querySelectorAll(".is-invalid").forEach((inputNode) => {
        inputNode.classList.remove("is-invalid");
    });
    document.querySelectorAll(".invalid-feedback").forEach((divMsg) => {
        divMsg.remove();
    });
}
//main flow
document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();//chặn reset trang
    clearMsg();//xóa thông báo lỗi cũ
    //dom tới các input cần ktra
    const emailNode = document.querySelector("#email");
    const nameNode = document.querySelector("#name");
    const genderNode = document.querySelector("#gender");
    const passwordNode = document.querySelector("#password");
    const confirmedPasswordNode= document.querySelector("#confirmedPassword");
    //country
    const countryNode = document.querySelector("input[name='country']:checked"); 
    const agreeNode = document.querySelector("input#agree:checked");

    //kiểm tra
    let errorMsg = [
    //email
        isValid({
            value: emailNode.value,
            funcs: [isRequired, isEmail],
            parentNode: emailNode.parentElement,
            controlNodes: [emailNode],
        }),
        //name
        isValid({
            value: nameNode.value,
            funcs: [isRequired, isName],
            parentNode: nameNode.parentElement,
            controlNodes: [nameNode],
        }),
        //gender
        isValid({
            value: genderNode.value,
            funcs: [isRequired],
            parentNode: genderNode.parentElement,
            controlNodes: [genderNode],
        }),
        //password
        isValid({
            value: passwordNode.value,
            funcs: [isRequired, min(8), max(30)],
            parentNode: passwordNode.parentElement,
            controlNodes: [passwordNode],
        }),
        //confirmedPassword
        isValid({
            value: confirmedPasswordNode.value,
            funcs: [isRequired, min(8), max(30), isSame(passwordNode.value, "Confirmed Password", " Password")],
            parentNode: confirmedPasswordNode.parentElement,
            controlNodes: [confirmedPasswordNode],
        }),
        //country
        isValid({
            value: countryNode ? countryNode.value : "",
            //nếu có nút nào bị nhấn thì cứ lấy value, còn k thì chửi và value = ""
            funcs: [isRequired],
            parentNode: document.querySelector(".form-check-country"),
            controlNodes: document.querySelectorAll("input[name='country']"),//select là k có khoảng cách thừa
        }),
        //agree
        isValid({
            value: agreeNode ? agreeNode.value : "",
            funcs: [isRequired],
            parentNode: document.querySelector("#agree").parentElement,
            controlNodes: [document.querySelector("#agree")],
        }),
];
console.log(errorMsg);
let isValidForm = errorMsg.every((msg) => msg == "");

});

