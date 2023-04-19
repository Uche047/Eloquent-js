function min(x, y) {
    if (x < y) {
        return x;
    }
    else if (x == y) {
        return null;
    }
    else {
        return y;
    }


}
function Even(x) {
    if (x > 0) {
        if (x == 0) {
             return true;
        }
        else if (x == 1) {
            return false;
         }
        else {
         return Even(x - 2);
        }
    }
    else {
        x = x * -1;
        return Even(x);
    }
 }