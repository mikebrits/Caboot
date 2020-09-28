// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
    const date = new Date();
    res.statusCode = 200;
    res.send(date.getTime());
};
