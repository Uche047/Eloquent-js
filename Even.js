function even(x) {
    if (x == 0) {
             return true;
    }
    else if (x == 1) {
            return false;
     }
    else if (x > 1) {
         return even(x - 2);
    }
    else {
        x = x * -1;
        return even(x);
    }
    
    
 }

 //Bean Counting
 function countB(string){
    let count = 0 ;
    for (let i = 0; i < string.length - 1; i++) {
        if (string[i] == "B") {
            count++;
        }
    }
    return count;
}

function countChar(string, cha){
    let count = 0 ;
    for (let i = 0; i < string.length; i++) {
        if (string[i] === cha) {
            count++;
        }
    }
    return count;
}

function countB(string,cha = "B"){
    console.log(countChar(string, cha));
}