import { HTTPSTATUS } from "../config/http.config.js";

export const errorHandler = (err, req, res, next) => {
    console.log(`error occured from path ${req.path}`, err);
    if(err instanceof SyntaxError) return res.status(HTTPSTATUS.BAD_REQUEST).json({message: "Invalid JSON format.please check your request body"});
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? "🥞" : "server error"
    });
};