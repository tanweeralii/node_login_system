function myfunction() {
	var x = document.getElementById("password");
	var y = document.getElementById("confirm_password");
	if (x.type === "password" && y.type=="password") {
		x.type = "text";
		y.type = "text";
		document.getElementById("img").src = "./images/unlocked.png";
	} else {
		x.type = "password";
		y.type = "password"
		document.getElementById("img").src = "./images/locked.png";
	}
}
document.getElementById('google').addEventListener('click',function(){
    $.post('google',function(data,status){
      location.href = data;
    })
});
const form = {
    first_name: document.getElementById('first_name'),
    last_name: document.getElementById('last_name'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    confirm_password: document.getElementById('confirm_password'),
    message: document.getElementById('internal-error'),
    submit: document.getElementById('register')
};
form.submit.addEventListener('click', () => {
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
    const requestData = `first_name=${form.first_name.value}&last_name=${form.last_name.value}&email=${form.email.value}&password=${form.password.value}&confirm_password=${form.confirm_password.value}`;
    request.open('post', 'Register');
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(requestData);
});
function handleResponse(responseObject){
    if(responseObject.ok=='true'){
     	while(form.message.firstChild){
            form.message.removeChild(form.message.firstChild);
        } 
        location.href='success.html';
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
};
