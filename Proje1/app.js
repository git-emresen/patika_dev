
const pi=Math.PI;

function findCircleArea(radius){
    return pi*(Math.pow(radius,2))
}

let area=findCircleArea(process.argv[2]);
console.log(`calculated circle area is: ${area}`)

