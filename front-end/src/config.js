const config = {
    backendURL:
        process.env.NODE_ENV === "development"
            ? "https://localhost:3000"
            : "https://ec2-3-133-126-162.us-east-2.compute.amazonaws.com:3000",
    websocketURL:
        process.env.NODE_ENV === "development"
            ? "wss://localhost:3000"
            : "wss://ec2-3-133-126-162.us-east-2.compute.amazonaws.com:3000",
};

console.log(process.env.NODE_ENV === "development"
? "https://localhost:3000"
: "https://ec2-3-133-126-162.us-east-2.compute.amazonaws.com:3000");

export default config;
