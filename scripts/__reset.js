var x = document.getElementById("target1"); 
var y = document.getElementById("target2"); 
var z = document.getElementById("target3");
x.style.visibility = 'hidden';
y.style.visibility = 'hidden';
z.style.visibility = 'hidden';
function myfunction() {
    var x = document.getElementById("new_password");
    var y = document.getElementById("confirm_password");
    if (x.type === "password" && y.type=="password") {
        x.type = "text";
        y.type = "text";
        document.getElementById("img").src = "./images/unlocked.png";
    } else {
        x.type = "password";
        y.type = "password";
        document.getElementById("img").src = "./images/locked.png";
    }
}
function showme(){
    var x = document.getElementById("target1");
    var y = document.getElementById("target");
    x.style.visibility = 'visible';
    y.style.visibility = 'hidden';
}
function showme2(){
  	var x = document.getElementById("target2");
  	var y = document.getElementById("target3");
  	var z = document.getElementById("target1");
  	x.style.visibility = 'visible';
  	y.style.visibility = 'visible';
  	z.style.visibility = 'hidden';
}
const form = {
    email: document.getElementById('reg_email'),
    message: document.getElementById('internal-error'),
    submit: document.getElementById('send_code')
};
form.submit.addEventListener('click', () => {
    sessionStorage.setItem('email',`${form.email.value}`);
    const request = new XMLHttpRequest();

    request.onload = () => {
        let responseObject = null;

        try{
            responseObject = JSON.parse(request.responseText);
        }catch(e){
            console.error('Could not parse JSON!');
        }

        if(responseObject){
            handleResponse(responseObject);
        }
    }
    const requestData = `email=${form.email.value}`;

    request.open('post', 'check_email');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(requestData);
});
const form1 = {
    code: document.getElementById('code'),
    message: document.getElementById('internal-error'),
    submit: document.getElementById('submit_code')
};
form1.submit.addEventListener('click', () => {
    const requestData = `${form1.code.value}`;
    var abc = sessionStorage.getItem('abc');
    var abc_decode = atob(abc);
    if(abc_decode == requestData){
        while(form.message.firstChild){
            form.message.removeChild(form.message.firstChild);
        }
        showme2();
        sessionStorage.removeItem("abc");
    }
    else{
        while(form.message.firstChild){
            form.message.removeChild(form.message.firstChild);
        }
        const li = document.createElement('li');
        li.textContent = "Wrong Code!";
        form.message.appendChild(li);
        form.message.style.display = "block";
    }
})
function handleResponse(responseObject){
   	if(responseObject.ok=="true"){
     	sessionStorage.setItem('abc',responseObject.encode);
     	form.message.removeChild(form.message.firstChild);
     	showme();
   	}
    else{
        while(form.message.firstChild){
            form.message.removeChild(form.message.firstChild);
        }
        const li = document.createElement('li');
        li.textContent = responseObject.message;
        form.message.appendChild(li);
        form.message.style.display = "block";
    }
}
const form2 = {
    email: sessionStorage.getItem('email'),
    password: document.getElementById('new_password'),
    confirm_password: document.getElementById('confirm_password'),
    message: document.getElementById('internal-error'),
    submit: document.getElementById('reset')
};
form2.submit.addEventListener('click', () => {
    const request = new XMLHttpRequest();
    request.onload = () => {
        let responseObject1 = null;
        try{
            responseObject1 = JSON.parse(request.responseText);
        }catch(e){
            console.error('Could not parse JSON!');
        }
        if(responseObject1.ok=="true"){
            alert("Password has been changed");
            window.location = "Login.html";
        }
        else{
            while(form.message.firstChild){
              form.message.removeChild(form.message.firstChild);
            }
            const li = document.createElement('li');
            li.textContent = responseObject1.message;
            form.message.appendChild(li);
            form.message.style.display = "block";
        }
    }
    const requestData = `email=${form2.email}&password=${form2.password.value}&confirm_password=${form2.confirm_password.value}`;
    request.open('post', 'set_password');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(requestData);
});
         
    