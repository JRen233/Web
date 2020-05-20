function myFunction1() {
	var myPic = document.getElementById("myImage");
    myPic.src = "harshit.jpg";
	myPic.alt = "harshit.jpg";
}
function myFunction2() {
	var myPic = document.getElementById("myImage");
    myPic.src = "ruofeng.jfif";
	myPic.alt = "ruofeng.jfif";
}
function myFunction3() {
	var myPic = document.getElementById("myImage");
    myPic.src = "yang.jfif";
	myPic.alt = "yang.jfif";
}

function check() {	
	var pass = document.getElementById("ID1");
	var result = document.getElementById("ID2");
	var value = pass.value;
	var strength = 0;
	var barV = document.getElementById("ID3");

if (value.length < 6) {
	result.innerHTML = ("Too Short");
	barV.value = "0";
}
else{
if (value.length > 7) strength += 1
// If password contains both lower and uppercase characters, increase strength value.
if (value.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1
// If it has numbers and characters, increase strength value.
if (value.match(/([a-zA-Z])/) && value.match(/([0-9])/)) strength += 1
// If it has one special character, increase strength value.
if (value.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
// If it has two special characters, increase strength value.
if (value.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
// Calculated strength value, we can return messages
// If value is less than 2
if (strength < 2) {
	barV.value = "3";
	result.innerHTML = ("Weak");
} else if (strength == 2) {
	barV.value = "6";
	result.innerHTML = ("Medium");
} else {
	barV.value = "9";
	result.innerHTML = ("Strong");
}
}
}