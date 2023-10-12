module.exports = func=>{
    return (req, res, next)=>{
        console.log("I am in func ");
        func(req, res, next).catch(next);
    }
}

/* Above code can be rewritten as follow */

// function myMiddleware(func) {
//     return function(req, res, next) {
//         console.log("I am in myMiddleware");
//         func(req, res, next).catch(next);
//     };
// }

// module.exports =myMiddleware;