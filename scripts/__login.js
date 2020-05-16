$(document).ready(function(){
  var checkbox = document.querySelector('input[name=myCheckbox]');
  checkbox.addEventListener( 'change', function(event) {
    if(checkbox.checked) {
      sessionStorage.setItem('set',1);
    }
    else{
      sessionStorage.setItem('set',0);
    }
  });
});
document.getElementById('google').addEventListener('click',function(){
  $.post('google',function(data,status){
    location.href = data;
  })
});
const form = {
  email: document.getElementById('email'),
  password: document.getElementById('password'),
  message: document.getElementById('internal-error'),
  submit: document.getElementById('login')
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
  const requestData = `email=${form.email.value}&password=${form.password.value}`;
  request.open('post','Login');
  request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  request.send(requestData);
});
function handleResponse(responseObject){
  if(responseObject.ok=='true'){
    if(sessionStorage.getItem('set')==1){
      var uname2 = sessionStorage.getItem('uname');
      localStorage.setItem('uname', uname2);
    }
    while(form.message.firstChild){
      form.message.removeChild(form.message.firstChild);
    }
    location.href = 'success.html';
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