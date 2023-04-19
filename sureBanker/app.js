let list = document.querySelector("select");
let button = document.querySelector("button");
let body = document.querySelector("body");
body.style.background = "#00dfca"; // Setting some style preferences
let note = document.querySelector("textarea");

let arr = [];
// Sending a get request to fetch files in the public directory
fetch("/sureBanker/unique/")
.then(resp => resp.text())
.then(resp => {
        arr.push(resp);
        console.log(resp)  
});
// Waiting for fetch to resolve 
setTimeout(()=> {
     arr = arr[0].split("\n")
    console.log(arr)
    createSelectArea(arr)
},100)
   
// Creates a select area with option bearing the public directories content
function createSelectArea(arr) {
    list.textContent = "";
    for (let name of arr) {
    	let option = document.createElement("option");
    	option.textContent = name;
    	list.appendChild(option);
    }
    // Sending a GET request for the selected item in the directory when the select options are initially created and storing result in the 
    // textarea value so that it shows in the textarea
    fetch("/sureBanker/unique/" + list.value).then(resp => resp.text())
    .then(resp => {
        note.value = resp;
      
    });
    //Looping through a list of options in the select element
    for (let i = 0;  i < list.length; i++) { 
        // Creating textarea which will display file contents available in my server
        let viewpad = document.createElement("textarea");
        viewpad.id = i // Giving the textarea elements id for easy manipulation
        // Setting some style preferences
        viewpad.style.width = "100vw";
        viewpad.style.height = "auto";
        viewpad.style.color = "snow";
        viewpad.style.background = "#009688";
        //pad.style.display = "inline";
        let linebreak = document.createElement("br"); // Creating a line break element
    // The list created is the select element which has some options 
    // list[i].value gets the content in those options which are file names in our directory
    fetch("/sureBanker/unique/" + list[i].value).then(resp => resp.text())
    .then(resp => {
        viewpad.textContent = resp;  
        body.appendChild(viewpad)
        body.appendChild(linebreak)

    })
    }    
    
}

list.addEventListener("change", () => {
    // Updates the text area every time another file is selected
    fetch("/sureBanker/unique/" + list.value)
    .then(resp => resp.text())
    .then(resp => {
         note.value = resp;
    });
    });
// Updating the content in the directory using the fetch api anytime the form is submited
let form = document.querySelector("form") 
form.addEventListener("submit", () => {
    event.preventDefault()
    fetch("/sureBanker/unique/" + list.value, {
        method: "PUT",
        body: note.value
    })
   // Displaying the updated files when form is submitted
    for (let i = 0;  i < list.length; i++) { 
        let viewpad = document.getElementById(i); // Getting earlier created textarea elements
        fetch("/sureBanker/unique/" + list[i].value).then(resp => resp.text())
        .then(resp => {
        viewpad.value = resp;  // Setting their value to the response from the fetch request to my server
        })
    }
    
        
});
    