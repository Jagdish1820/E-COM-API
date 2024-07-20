const jwtAuth = (req, res, next) => {
    // 1. Read the token.
    console.log(req.headers);
    const token = req.headers['authorization'];
    //2. if no token, return the error.
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    // 3. check if token is valid.
    try {
        const payload = jwt.verify(
            token,
            'juNRxsh5J1ojign5jhzXH6Spmzqmfa59',
        );
        req.userID = payload.userID;
        console.log(payload);
    }
    catch(err){
        // 4. return error.
        return res.status(401).send('Unauthorized');
    }
    // 5. call next middleware.
    next();
};

export default jwtAuth;