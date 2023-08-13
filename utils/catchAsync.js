module.exports = func=>{
    return (req, res, next)=>{
        console.log("I am in func ");
        func(req, res, next).catch(next);
    }
}
