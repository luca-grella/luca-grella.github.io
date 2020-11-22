var input = document.getElementById("secret");
input.addEventListener("keyup", function(event){
      if (event.keyCode === 13) 
      {
        event.preventDefault();
        document.getElementById("EnterButton").click();
      }
    });

function ProtectedArea() {
location.href = document.getElementById('secret').value + ".html";
    };