// function to clear HTML element 

export function clearHTML(parentElement) {
    if (parentElement) {
        parentElement.innerHTML = "";
    } else {
        //console.log(`Parent element is null or undefined.`)
    }
    
}