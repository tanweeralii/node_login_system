$(document).ready(function(){
    $.post('code',{'code':window.location.href},function(data,status){
    	sessionStorage.setItem('email',data.email);
      	sessionStorage.setItem('id',data.id);
    })
})