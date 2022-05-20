let arr = [
	{
		name: "Shoes",
		price: 500,
		quantity: 5,
	},
	{
		name: "Shoesssss",
		price: 100,
		quantity: 55,
	},
	{
		name: "Sho",
		price: 5050,
		quantity: 1,
	},
];
function myFunction() {
	var x = document.getElementById("table").getElementsByTagName("tbody")[0];
	arr.forEach((obj) => {
		var row = x.insertRow();
		row.insertCell().append(obj.name);
		row.insertCell().append(obj.price);
		row.insertCell().append(obj.quantity);
		row.insertCell().append(obj.quantity * obj.price);
	});
}
setTimeout(() => {
	myFunction();
}, 1);
